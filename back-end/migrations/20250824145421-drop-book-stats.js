"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop table bookstats
    await queryInterface.dropTable("bookstats");
  },

  async down(queryInterface, Sequelize) {
    // Kalau mau rollback, buat lagi table bookstats
    await queryInterface.createTable("bookstats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      wishlistCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      purchaseCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      popularityScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
};
