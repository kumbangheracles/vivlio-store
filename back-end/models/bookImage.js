const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookImage = sequelize.define(
  "BookImages",
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
        model: "Books",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "BookImages",
    timestamps: true,
  }
);

module.exports = BookImage;
