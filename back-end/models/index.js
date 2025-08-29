const Book = require("./books");
const BookCategory = require("./book_category");
const User = require("./user");
const Role = require("./role");
const BookImage = require("./bookImage");
const BookGenres = require("./bookgenres");
const Genre = require("./genre");
const UserImage = require("./UserImage");
const BookStats = require("./bookStats");
const UserWishlist = require("./userWishlist");
const UserCart = require("./userCart");
const UserPurchases = require("./userPurchases");

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
  as: "Books",
});

// User ↔ Role
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

// Book ↔ Genre (Many-to-Many)
Book.belongsToMany(Genre, {
  through: BookGenres,
  foreignKey: "bookId",
  otherKey: "genreId",
  as: "genres",
  onDelete: "CASCADE",
});
Genre.belongsToMany(Book, {
  through: BookGenres,
  foreignKey: "genreId",
  otherKey: "bookId",
  as: "books",
});

// Users ↔ UserImage
User.hasOne(UserImage, {
  foreignKey: "userId",
  as: "profileImage",
});

UserImage.belongsTo(User, {
  foreignKey: "userId",
  as: "Users",
});

// Users ↔ Books
User.hasMany(Book, {
  foreignKey: "createdByAdminId",
});

Book.belongsTo(User, {
  foreignKey: "createdByAdminId",
});

// Users ↔ Genre
User.hasMany(Genre, {
  foreignKey: "createdByAdminId",
});
Genre.belongsTo(User, {
  foreignKey: "createdByAdminId",
});

// Users ↔ BookCategory
User.hasMany(BookCategory, {
  foreignKey: "createdByAdminId",
});
BookCategory.belongsTo(User, {
  foreignKey: "createdByAdminId",
});
// Users ↔ Users
User.hasMany(User, {
  foreignKey: "createdByAdminId",
});
User.belongsTo(User, {
  foreignKey: "createdByAdminId",
});

// Books ↔ BookStats
Book.hasOne(BookStats, { foreignKey: "bookId", as: "stats" });
BookStats.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// User ↔ UserWishlist ↔ Book (Many-to-Many via join table)
User.belongsToMany(Book, {
  through: UserWishlist,
  foreignKey: "userId",
  as: "wishlistBooks",
});

Book.belongsToMany(User, {
  through: UserWishlist,
  foreignKey: "bookId",
  as: "wishlistUsers",
});

// User ↔ UserPurchases ↔ Book (Many-to-Many via join table)
User.belongsToMany(Book, {
  through: UserPurchases,
  foreignKey: "userId",
  as: "purchasesBooks",
});

Book.belongsToMany(User, {
  through: UserPurchases,
  foreignKey: "bookId",
  as: "purchasesUsers",
});

// User ↔ UserCart ↔ Book (Many-to-Many via join table)

User.belongsToMany(Book, {
  through: UserCart,
  foreignKey: "userId",
  as: "cartBooks",
});

Book.belongsToMany(User, {
  through: UserCart,
  foreignKey: "bookId",
  as: "cartUsers",
});

//UserWishlist ↔ Book

UserWishlist.belongsTo(Book, { foreignKey: "bookId", as: "book" });
Book.hasMany(UserWishlist, { foreignKey: "bookId", as: "wishlistEntries" });

module.exports = {
  Book,
  BookCategory,
  BookImage,
  User,
  Role,
  Genre,
  BookGenres,
  UserImage,
  BookStats,
  UserWishlist,
  UserCart,
  UserPurchases,
};
