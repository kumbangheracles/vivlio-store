const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookImage = sequelize.define(
  "bookimages",
  {
    id: {
      type: DataTypes.STRING,

      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "bookimages",
    timestamps: true,
  },
);

module.exports = BookImage;
