const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserPurchases = sequelize.define(
  "UserPurchases",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    orderGroupId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    midtransToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    priceAtPurchases: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiry_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    fraud_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gross_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    merchant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payment_amounts: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    payment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    signature_key: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    transaction_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    transaction_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    va_numbers: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "UserPurchases",
    timestamps: false,
  },
);

module.exports = UserPurchases;
