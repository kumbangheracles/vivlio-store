"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userpurchases", "orderId", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("userpurchases", "paymentStatus", {
      type: Sequelize.ENUM("PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    });

    await queryInterface.addColumn("userpurchases", "midtransToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userpurchases", "orderId");
    await queryInterface.removeColumn("userpurchases", "paymentStatus");
    await queryInterface.removeColumn("userpurchases", "midtransToken");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_userpurchases_paymentStatus";',
    );
  },
};
