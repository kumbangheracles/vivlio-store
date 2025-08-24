const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserWishlist = sequelize.define(
  "UserWishlist",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "UserWishlist",
    timestamps: true,
  }
);

module.exports = UserWishlist;
