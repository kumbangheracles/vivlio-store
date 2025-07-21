"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      book_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      categoryId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "book_category",
          key: "categoryId",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      isPopular: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Books");
  },
};
