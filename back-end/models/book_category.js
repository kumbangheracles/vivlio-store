const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Book = require("./books");
const BookCategory = sequelize.define(
  "book_category",
  {
    categoryId: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
