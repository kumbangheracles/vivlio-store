"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop table BookStats
    await queryInterface.dropTable("BookStats");
  },

  async down(queryInterface, Sequelize) {
    // Kalau mau rollback, buat lagi table BookStats
    await queryInterface.createTable("BookStats", {
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
