const Book = require("./books");
const BookCategory = require("./book_category");
const User = require("./user");
const Role = require("./role");
const BookImage = require("./bookImage");
const BookGenres = require("./bookgenres");
const Genre = require("./genre");

// Book ↔ Category
BookCategory.hasMany(Book, {
  foreignKey: "categoryId",
  as: "books",
});
Book.belongsTo(BookCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Book ↔ BookImage
Book.hasMany(BookImage, {
  foreignKey: "bookId",
  as: "images",
});
BookImage.belongsTo(Book, {
  foreignKey: "bookId",
  as: "book",
});

// User ↔ Role
User.belongsTo(Role, { foreignKey: "role" });
Role.hasMany(User, { foreignKey: "name" });

// Book ↔ Genre (Many-to-Many)
Book.belongsToMany(Genre, {
  through: BookGenres,
  foreignKey: "bookId",
  otherKey: "genreId",
  as: "genres",
});
Genre.belongsToMany(Book, {
  through: BookGenres,
  foreignKey: "genreId",
  otherKey: "bookId",
  as: "books",
});

module.exports = {
  Book,
  BookCategory,
  BookImage,
  User,
  Role,
  Genre,
  BookGenres,
};
