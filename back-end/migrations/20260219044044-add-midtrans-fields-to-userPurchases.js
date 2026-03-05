"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userpurchases", "currency", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "expiry_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "fraud_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "gross_amount", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "merchant_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "payment_amounts", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "payment_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "signature_key", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "status_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "status_message", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "transaction_id", {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "transaction_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "transaction_time", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("userpurchases", "va_numbers", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userpurchases", "currency");
    await queryInterface.removeColumn("userpurchases", "expiry_time");
    await queryInterface.removeColumn("userpurchases", "fraud_status");
    await queryInterface.removeColumn("userpurchases", "gross_amount");
    await queryInterface.removeColumn("userpurchases", "merchant_id");
    await queryInterface.removeColumn("userpurchases", "payment_amounts");
    await queryInterface.removeColumn("userpurchases", "payment_type");
    await queryInterface.removeColumn("userpurchases", "signature_key");
    await queryInterface.removeColumn("userpurchases", "status_code");
    await queryInterface.removeColumn("userpurchases", "status_message");
    await queryInterface.removeColumn("userpurchases", "transaction_id");
    await queryInterface.removeColumn("userpurchases", "transaction_status");
    await queryInterface.removeColumn("userpurchases", "transaction_time");
    await queryInterface.removeColumn("userpurchases", "va_numbers");
  },
};
