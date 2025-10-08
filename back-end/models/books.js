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
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    book_type: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdByAdminId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    //tinggal nambahin ENUM "Out of stock" dan field stock
    status: {
      type: DataTypes.ENUM("PUBLISHED", "UNPUBLISHED"),
      allowNull: false,
      defaultValue: "UNPUBLISHED",
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
