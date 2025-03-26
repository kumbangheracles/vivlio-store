const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Book = sequelize.define(
  "Books",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    book_type: {
      type: DataTypes.STRING,
    },
    book_subType: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt otomatis dibuat
  }
);

module.exports = Book;
