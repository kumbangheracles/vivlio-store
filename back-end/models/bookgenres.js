const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const BookGenres = sequelize.define("book_genres", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookId: {
    type: DataTypes.STRING,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: "Books",
      key: "id",
    },
  },
  genreId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "genre",
      key: "genreId",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});
module.exports = BookGenres;
