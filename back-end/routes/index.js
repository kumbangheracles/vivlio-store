const Book = require("./book");
const BookCategory = require("./book_category");

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
