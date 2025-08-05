const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserImage = sequelize.define(
  "UserImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
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
    tableName: "UserImages",
    timestamps: true,
  }
);

module.exports = UserImage;
