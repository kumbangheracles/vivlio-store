const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Image = require("./images");
const BookCategory = require("./book_category");
const Book = sequelize.define(
  "Books",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    book_type: {
      type: DataTypes.STRING,
    },

    book_cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "book_category", // nama tabel
        key: "id",
      },
    },
  },
  {
    tableName: "Books",
    timestamps: true, // createdAt & updatedAt otomatis dibuat
  }
);

Book.hasOne(Image, {
  foreignKey: "bookId",
  as: "coverImage", // Alias untuk query
  scope: {
    type: "cover", // Hanya ambil gambar dengan tipe "cover"
  },
});
Image.belongsTo(Book, { foreignKey: "bookId" });

// Book.belongsTo(BookCategory, {
//   foreignKey: "categoryId",
//   as: "category",
// });

module.exports = Book;
