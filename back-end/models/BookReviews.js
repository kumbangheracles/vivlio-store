const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookReview = sequelize.define(
  "bookreviews",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,

      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("APPROVED", "IS_UNDER_APPROVAL", "REJECTED"),
      allowNull: false,
      defaultValue: "IS_UNDER_APPROVAL",
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "bookreviews",
    timestamps: true,
  },
);

module.exports = BookReview;
