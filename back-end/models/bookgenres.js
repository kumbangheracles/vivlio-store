const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BookGenres = sequelize.define("book_genres", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  genreId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
module.exports = BookGenres;
