const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Role = sequelize.define(
  "roles",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  },
);

module.exports = Role;
