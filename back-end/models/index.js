const Book = require("./books");
const BookCategory = require("./book_category");
const User = require("./user");
const Role = require("./role");
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

User.belongsTo(Role, { foreignKey: "role" });
Role.hasMany(User, { foreignKey: "name" });
