"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const [admins] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'herkalsuperadmin' LIMIT 1;`
    );
    if (admins.length === 0) {
      throw new Error("No admin found. Please seed admin user first.");
    }

    const adminId = admins[0].id;
    return queryInterface.bulkInsert("book_category", [
      {
        categoryId: uuidv4(),
        name: "Programming",
        status: true,
        createdByAdminId: adminId,
        description: "Books about software development and programming",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("book_category", null, {});
  },
};
