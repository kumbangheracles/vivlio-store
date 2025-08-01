const { Book, BookImage, Genre } = require("../models/index");
// const Book = require("../models/books");
// const BookImage = require("../models/bookImage");
// const Genre = require("../models/genre");
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
      const { count, rows } = await Book.findAndCountAll({
        where: filters,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl"],
          },
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
            attributes: ["genreid", "genre_title"],
          },
        ],
        offset,
      });
      res.status(200).json({
        status: "Success",
        message: "Book retrieved successfully",
        results: rows,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findOne({
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
        result: book,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { images } = req.body;

      const parsedImages =
        typeof images === "string" ? JSON.parse(images) : images;

      if (!parsedImages || parsedImages.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one book cover is required." });
      }

      const newBook = await Book.create(
        {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
          book_type: req.body.book_type,
          status: req.body.status,
          description: req.body.description,
          isPopular: req.body.isPopular || false,
          categoryId: req.body.categoryId || null,
        },
        { transaction: t }
      );

      const bookImagesData = parsedImages.map((img) => ({
        bookId: newBook.id,
        imageUrl: img.imageUrl,
      }));
      await BookImage.bulkCreate(bookImagesData, { transaction: t });

      let genreIds = req.body.genres;
      if (typeof genreIds === "string") {
        genreIds = [genreIds];
      }
      if (Array.isArray(genreIds)) {
        await newBook.setGenres(genreIds, { transaction: t });
      }

      await t.commit();

      res.status(200).json({
        message: "Book created Successfully",
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
      const { title, author, price, book_type, isPopular, categoryId } =
        req.body;
      let images = req.body.images;
      // Update book utama
      await Book.update(req.body, { where: { id }, transaction: t });
      console.log("typeof images:", typeof images);
      if (typeof images === "string") {
        try {
          images = JSON.parse(images);
        } catch (err) {
          console.error("Gagal parse images:", err.message);
          images = [];
        }
      }
      if (Array.isArray(images)) {
        const sentImageIds = images
          .filter((img) => img.id)
          .map((img) => img.id);
        console.log("sentImageIds:", sentImageIds);

        // update gambar yang sudah ada
        const existingImages = images.filter((img) => img.id && img.imageUrl);
        for (const img of existingImages) {
          await BookImage.update(
            { imageUrl: img.imageUrl },
            { where: { id: img.id, bookId: id }, transaction: t }
          );
        }

        // hapus gambar yang tidak dikirim dari frontend
        if (sentImageIds.length > 0) {
          await BookImage.destroy({
            where: {
              bookId: id,
              id: { [Op.notIn]: sentImageIds },
            },
            transaction: t,
          });
        }

        // tambahkan gambar baru
        const newImages = images.filter((img) => !img.id && img.imageUrl);
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

      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      await book.setGenres([]);
      const result = await Book.destroy({ where: { id } });

      res.status(200).json({
        message: "Book deleted successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
