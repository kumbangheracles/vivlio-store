const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

module.exports = User;
