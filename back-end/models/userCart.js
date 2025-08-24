const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserCart = sequelize.define(
  "UserCart",
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
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("DRAFT", "CHECKED_OUT"),
      allowNull: false,
      defaultValue: "DRAFT",
    },
  },
  {
    tableName: "UserCart",
    timestamps: true,
  }
);

module.exports = UserCart;
