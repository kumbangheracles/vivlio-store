"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserPurchases", "currency", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "expiry_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "fraud_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "gross_amount", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "merchant_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "payment_amounts", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "payment_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "signature_key", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "status_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "status_message", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "transaction_id", {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "transaction_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "transaction_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("UserPurchases", "va_numbers", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserPurchases", "currency");
    await queryInterface.removeColumn("UserPurchases", "expiry_time");
    await queryInterface.removeColumn("UserPurchases", "fraud_status");
    await queryInterface.removeColumn("UserPurchases", "gross_amount");
    await queryInterface.removeColumn("UserPurchases", "merchant_id");
    await queryInterface.removeColumn("UserPurchases", "payment_amounts");
    await queryInterface.removeColumn("UserPurchases", "payment_type");
    await queryInterface.removeColumn("UserPurchases", "signature_key");
    await queryInterface.removeColumn("UserPurchases", "status_code");
    await queryInterface.removeColumn("UserPurchases", "status_message");
    await queryInterface.removeColumn("UserPurchases", "transaction_id");
    await queryInterface.removeColumn("UserPurchases", "transaction_status");
    await queryInterface.removeColumn("UserPurchases", "transaction_time");
    await queryInterface.removeColumn("UserPurchases", "va_numbers");
  },
};
