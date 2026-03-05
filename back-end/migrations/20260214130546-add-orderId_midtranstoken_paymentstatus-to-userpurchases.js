"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserPurchases", "orderId", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("UserPurchases", "paymentStatus", {
      type: Sequelize.ENUM("PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    });

    await queryInterface.addColumn("UserPurchases", "midtransToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserPurchases", "orderId");
    await queryInterface.removeColumn("UserPurchases", "paymentStatus");
    await queryInterface.removeColumn("UserPurchases", "midtransToken");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_UserPurchases_paymentStatus";',
    );
  },
};
