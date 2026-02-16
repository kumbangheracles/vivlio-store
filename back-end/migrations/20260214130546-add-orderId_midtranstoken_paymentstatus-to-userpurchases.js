"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userPurchases", "orderId", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("userPurchases", "paymentStatus", {
      type: Sequelize.ENUM("PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    });

    await queryInterface.addColumn("userPurchases", "midtransToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userPurchases", "orderId");
    await queryInterface.removeColumn("userPurchases", "paymentStatus");
    await queryInterface.removeColumn("userPurchases", "midtransToken");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_userPurchases_paymentStatus";',
    );
  },
};
