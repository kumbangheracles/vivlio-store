const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ArticleImages = sequelize.define(
  "ArticleImages",
  {
    id: {
      type: DataTypes.STRING,

      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    articleId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Articles",
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
    tableName: "ArticleImages",
    timestamps: true,
  }
);

module.exports = ArticleImages;
