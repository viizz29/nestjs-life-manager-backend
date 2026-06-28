'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Create bookmarks table
      await queryInterface.createTable(
        'bookmarks',
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

          node_sn: {
            type: Sequelize.BIGINT,
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

      await queryInterface.addConstraint('bookmarks', {
        type: 'primary key',
        fields: ['user_id', 'node_sn'],
        name: 'pk_bookmarks',
        transaction,
      });

      await queryInterface.addConstraint('bookmarks', {
        type: 'foreign key',
        fields: ['user_id', 'node_sn'],
        name: 'fk_bookmarks_data_nodes',
        references: {
          table: 'data_nodes',
          fields: ['user_id', 'sn'],
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('bookmarks', { transaction });
    });
  },
};
