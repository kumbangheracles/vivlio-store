const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Sesuaikan dengan konfigurasi Sequelize

class Image extends Model {}

Image.init(
  {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Image",
  }
);

module.exports = Image;
