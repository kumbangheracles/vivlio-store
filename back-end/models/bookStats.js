const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const BookStats = sequelize.define(
  "BookStats",
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
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    wishlistCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cartCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    purchases: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "BookStats",
    timestamps: true,
  }
);

module.exports = BookStats;
