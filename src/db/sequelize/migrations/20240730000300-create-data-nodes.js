'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Create data_nodes table
      await queryInterface.createTable(
        'data_nodes',
        {
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          sn: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },

          parent_sn: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },

          position: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },

          note: {
            type: Sequelize.TEXT,
            allowNull: false,
          },

          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        {
          transaction,
        },
      );

      await queryInterface.addConstraint('data_nodes', {
        type: 'primary key',
        fields: ['user_id', 'sn'],
        name: 'pk_data_nodes',
        transaction,
      });

      await queryInterface.addColumn(
        'users',
        'next_data_node_sn',
        {
          allowNull: false,
          type: Sequelize.BIGINT,
          defaultValue: 1,
        },
        { transaction },
      );

      // create trigger for generating ids, sequentially
      await queryInterface.sequelize.query(
        `
        CREATE OR REPLACE FUNCTION generate_next_data_node_sn() RETURNS TRIGGER AS $$
        DECLARE
          next_sn BIGINT;
        BEGIN
          -- Fetch the next_sn from the users table where id = NEW.user_id
          SELECT next_data_node_sn INTO next_sn FROM users WHERE id = NEW.user_id FOR UPDATE;
    
          NEW.sn := next_sn;
    
          UPDATE users SET next_data_node_sn = next_data_node_sn + 1 where id = NEW.user_id;
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
        { transaction },
      );

      // Create the trigger
      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER data_nodes_before_insert_generate_sn
        BEFORE INSERT ON "data_nodes"
        FOR EACH ROW
        EXECUTE FUNCTION generate_next_data_node_sn();
      `,
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Drop the trigger
      await queryInterface.sequelize.query(
        `
    DROP TRIGGER IF EXISTS data_nodes_before_insert_generate_sn ON "data_nodes";
  `,
        { transaction },
      );

      // Drop the trigger function
      await queryInterface.sequelize.query(
        `
    DROP FUNCTION IF EXISTS generate_next_data_node_sn();
  `,
        { transaction },
      );

      await queryInterface.removeColumn('users', 'next_data_node_sn', {
        transaction,
      });

      // Drop the table (this automatically removes constraints)
      await queryInterface.dropTable('data_nodes', { transaction });
    });
  },
};
