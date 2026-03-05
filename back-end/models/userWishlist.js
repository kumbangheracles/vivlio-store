const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserWishlist = sequelize.define(
  "userwishlist",
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
    tableName: "userwishlist",
    timestamps: true,
  },
);

module.exports = UserWishlist;
