const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Book = sequelize.define(
  "Books",
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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

    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "book_category",
        key: "id",
      },
    },
  },
  {
    tableName: "Books",
    timestamps: true,
  }
);

module.exports = Book;
