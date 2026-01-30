"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("BookReviews", "status", {
      type: Sequelize.ENUM("APPROVED", "IS_UNDER_APPROVAL", "REJECTED"),
      allowNull: true,
      defaultValue: "IS_UNDER_APPROVAL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("BookReviews", "status");
  },
};
