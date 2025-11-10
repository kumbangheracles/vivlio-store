const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Articles = sequelize.define(
  "Articles",
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdByAdminId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "UNPUBLISHED"),
      allowNull: false,
      defaultValue: "UNPUBLISHED",
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "Articles",
    timestamps: true,
  }
);

module.exports = Articles;
