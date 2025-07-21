const Books = require("../models/books");
const BookImage = require("../models/bookImage");
const { sequelize } = require("../config/database");
const uploader = require("../config/uploader");
module.exports = {
  async getAll(req, res) {
    const { isPopular, title, categoryId, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }
    if (categoryId) filters.categoryId = categoryId;
    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }

    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await Books.findAndCountAll({
        where: filters,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl"],
          },
        ],
        offset,
      });
      res.status(200).json({
        status: "Success",
        message: "Books retrieved successfully",
        results: rows,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async getOne(req, res) {
    try {
      const book = await Books.findOne({
        where: { id },
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl"],
          },
        ],
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({
        message: "Success",
        results: book,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one book cover is required." });
      }

      const uploadResults = await uploader.uploadMultiple(files);

      const newBook = await Books.create(
        {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
          book_type: req.body.book_type,
          isPopular: req.body.isPopular || false,
          categoryId: req.body.categoryId || null,
        },
        { transaction: t }
      );

      const bookImagesData = uploadResults.map((img) => ({
        bookId: newBook.id,
        imageUrl: img.secure_url,
      }));
      await BookImage.bulkCreate(bookImagesData, { transaction: t });

      await t.commit();

      res.status(200).json({
        message: "Book created with images",
        results: {
          ...newBook.toJSON(),
          images: bookImagesData,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  async updateBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, author, price, book_type, isPopular, categoryId, images } =
        req.body;

      // Update book utama
      await Book.update(
        { title, author, price, book_type, isPopular, categoryId },
        { where: { id }, transaction: t }
      );

      if (Array.isArray(images)) {
        // Ambil ID gambar yang dikirim dari frontend
        const sentImageIds = images
          .filter((img) => img.id)
          .map((img) => img.id);

        // Hapus gambar yang tidak ada di list
        await BookImage.destroy({
          where: {
            bookId: id,
            id: { [Op.notIn]: sentImageIds },
          },
          transaction: t,
        });

        // Tambahkan gambar baru (tanpa id)
        const newImages = images.filter((img) => !img.id);
        if (newImages.length > 0) {
          const imageData = newImages.map((img) => ({
            bookId: id,
            imageUrl: img.imageUrl,
          }));
          await BookImage.bulkCreate(imageData, { transaction: t });
        }
      }

      await t.commit();
      res.status(200).json({ message: "Book and images updated successfully" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const result = await Books.destroy({ where: { id } });
      res
        .status(200)
        .json({ message: "Book deleted successfully", result: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
