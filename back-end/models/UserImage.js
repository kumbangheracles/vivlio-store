const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserImage = sequelize.define(
  "userimages",
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
        model: "users",
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
    tableName: "userimages",
    timestamps: true,
  },
);

module.exports = UserImage;
