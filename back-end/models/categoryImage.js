const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CategoryImage = sequelize.define(
  "CategoryImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "book_category",
        key: "categoryId",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "CategoryImages",
    timestamps: true,
  }
);

module.exports = CategoryImage;
