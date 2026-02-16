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
  },
  {
    tableName: "UserPurchases",
    timestamps: false,
  },
);

module.exports = UserPurchases;
