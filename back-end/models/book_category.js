const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Book = require("./books");
const BookCategory = sequelize.define(
  "book_category",
  {
    categoryId: {
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
    timestamps: true,
  }
);

// BookCategory.hasMany(Book, {
//   foreignKey: "categoryId",
//   as: "categoryId",
// });
module.exports = BookCategory;
