"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userPurchases", "currency", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "expiry_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "fraud_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "gross_amount", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "merchant_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "payment_amounts", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "payment_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "signature_key", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "status_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "status_message", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "transaction_id", {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "transaction_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "transaction_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("userPurchases", "va_numbers", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userPurchases", "currency");
    await queryInterface.removeColumn("userPurchases", "expiry_time");
    await queryInterface.removeColumn("userPurchases", "fraud_status");
    await queryInterface.removeColumn("userPurchases", "gross_amount");
    await queryInterface.removeColumn("userPurchases", "merchant_id");
    await queryInterface.removeColumn("userPurchases", "payment_amounts");
    await queryInterface.removeColumn("userPurchases", "payment_type");
    await queryInterface.removeColumn("userPurchases", "signature_key");
    await queryInterface.removeColumn("userPurchases", "status_code");
    await queryInterface.removeColumn("userPurchases", "status_message");
    await queryInterface.removeColumn("userPurchases", "transaction_id");
    await queryInterface.removeColumn("userPurchases", "transaction_status");
    await queryInterface.removeColumn("userPurchases", "transaction_time");
    await queryInterface.removeColumn("userPurchases", "va_numbers");
  },
};
