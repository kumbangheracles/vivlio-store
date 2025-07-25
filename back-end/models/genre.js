const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Genre = sequelize.define(
  "genre",
  {
    genreId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    genre_title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "UNPUBLISHED"),
      allowNull: false,
      defaultValue: "UNPUBLISHED",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "genre",
    timestamps: true,
  }
);

module.exports = Genre;
