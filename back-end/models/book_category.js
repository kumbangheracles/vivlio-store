const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookCategory = sequelize.define(
  "book_category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "book_category",
    timestamps: false,
  }
);

module.exports = BookCategory;
