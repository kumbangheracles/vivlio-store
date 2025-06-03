const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Image = sequelize.define(
  "Images",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Books",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("cover", "gallery"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "Images",
  }
);

module.exports = Image;
