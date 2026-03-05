const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ArticleImages = sequelize.define(
  "articleimages",
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
        model: "articles",
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
    tableName: "articleimages",
    timestamps: true,
  },
);

module.exports = ArticleImages;
