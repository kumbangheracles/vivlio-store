const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserPurchases = sequelize.define(
  "UserPurchases",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    timestamps: true,
  }
);

module.exports = UserPurchases;
