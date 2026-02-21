const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    roleId: {
      type: DataTypes.STRING,
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
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_preference: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationCodeCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  },
);

module.exports = User;
