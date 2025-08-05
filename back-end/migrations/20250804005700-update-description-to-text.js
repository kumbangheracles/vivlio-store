"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("genre", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn("book_category", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("genre", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("book_category", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
