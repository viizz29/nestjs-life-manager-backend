'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Create 5 users
      const users = Array.from({ length: 5 }).map((_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password:
          '$2b$10$KiAcpDEwGrA9eZoqouDRz.do8oWxu7brPs.Py7WbQl9cX/CDTtWD6', // password123
        created_at: now,
        updated_at: now,
      }));

      // Insert users
      await queryInterface.bulkInsert('users', users, { transaction });

      // Step 2: Fetch inserted users (to get IDs)
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, name FROM "users";`,
        { type: Sequelize.QueryTypes.SELECT, transaction },
      );

      // loop through the user records
      const dataNodes = [];
      insertedUsers.forEach((user) => {
        ['item1', 'item2', 'item3'].forEach((item, index) => {
          dataNodes.push({
            user_id: user.id,
            sn: 1,
            position: index,
            note: `${user.name} ${item}`,
            created_at: now,
            updated_at: now,
          });
        });
      });

      await queryInterface.bulkInsert('data_nodes', dataNodes, { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Then delete users
      await queryInterface.bulkDelete('users', null, {});
    });
  },
};
