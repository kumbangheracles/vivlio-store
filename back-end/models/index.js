const Book = require("./books");
const BookCategory = require("./book_category");
const User = require("./user");
const Role = require("./role");
const BookImage = require("./bookImage");
BookCategory.hasMany(Book, {
  foreignKey: "categoryId",
  as: "books",
});

Book.belongsTo(BookCategory, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = {
  Book,
  BookCategory,
};

Book.hasMany(BookImage, {
  foreignKey: "bookId",
  as: "images",
});
BookImage.belongsTo(Book, {
  foreignKey: "bookId",
  as: "book",
});

User.belongsTo(Role, { foreignKey: "role" });
Role.hasMany(User, { foreignKey: "name" });
