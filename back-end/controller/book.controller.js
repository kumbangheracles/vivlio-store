const { Book, BookImage, Genre } = require("../models/index");
// const Book = require("../models/books");
// const BookImage = require("../models/bookImage");
// const Genre = require("../models/genre");
const { sequelize } = require("../config/database");
const uploader = require("../config/uploader");
const { Op } = require("sequelize");
const { deleteFromCloudinary } = require("../helpers/deleteCoudinary");
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
            attributes: ["id", "imageUrl", "public_id"],
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
        status: 200,
        message: "Success",
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
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            attributes: ["genreId", "genre_title"],
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
        public_id: img.public_id,
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
      const book = await Book.findByPk(id, { transaction: t });

      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "Book not found" });
      }

      const { title, author, price, book_type, isPopular, categoryId } =
        req.body;
      let images = req.body.images;
      let genreIds = req.body.genres;

      // Update book utama
      await Book.update(req.body, {
        where: { id },
        transaction: t,
      });

      // === Update genre relasi ===
      if (req.body.genres !== undefined) {
        let genreIds = req.body.genres;

        // Handle different input formats
        if (typeof genreIds === "string") {
          try {
            // Try to parse as JSON first
            genreIds = JSON.parse(genreIds);
          } catch {
            // If not JSON, treat as single ID
            genreIds = [genreIds];
          }
        }

        // Ensure it's an array and contains valid IDs
        if (Array.isArray(genreIds)) {
          // Convert to integers and filter invalid ones
          const validGenreIds = genreIds
            .map((id) => {
              if (typeof id === "object" && id.id) return parseInt(id.id);
              return parseInt(id);
            })
            .filter((id) => !isNaN(id) && id > 0);

          console.log("Valid genre IDs:", validGenreIds);

          // Update the association
          await book.setGenres(validGenreIds, { transaction: t });
        } else if (genreIds === null || genreIds === "") {
          // Clear all genres if empty
          await book.setGenres([], { transaction: t });
        }
      }
      // === Proses images dengan debugging ===
      console.log("=== DEBUG IMAGES ===");
      console.log("Raw images:", req.body.images);
      console.log("Images type:", typeof images);

      if (typeof images === "string") {
        try {
          images = JSON.parse(images);
          console.log("Parsed images:", images);
        } catch (err) {
          console.error("Gagal parse images:", err.message);
          images = [];
        }
      }

      if (Array.isArray(images)) {
        console.log("Images array:", images);

        const sentImageIds = images
          .filter((img) => img.id)
          .map((img) => img.id);
        console.log("sentImageIds:", sentImageIds);

        // Cek gambar yang ada di database sebelum update
        const existingImagesInDB = await BookImage.findAll({
          where: { bookId: id },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });
        console.log(
          "Existing images in DB:",
          existingImagesInDB.map((img) => img.id)
        );

        // Update gambar yang sudah ada
        const existingImages = images.filter((img) => img.id && img.imageUrl);
        console.log(
          "Images to update:",
          existingImages.map((img) => img.id)
        );

        for (const img of existingImages) {
          await BookImage.update(
            {
              imageUrl: img.imageUrl,
              public_id: img.public_id || null,
            },
            {
              where: { id: img.id, bookId: id },
              transaction: t,
            }
          );
        }

        // Hapus gambar yang tidak dikirim
        const imagesToDelete = existingImagesInDB.filter(
          (existingImg) => !sentImageIds.includes(existingImg.id)
        );

        console.log(
          "Images to delete:",
          imagesToDelete.map((img) => img.id)
        );

        if (imagesToDelete.length > 0) {
          // Delete dari Cloudinary
          console.log("Deleting from Cloudinary...");
          await Promise.all(
            imagesToDelete.map((img) => deleteFromCloudinary(img.imageUrl))
          );
          const deleteResult = await BookImage.destroy({
            where: {
              bookId: id,
              id: imagesToDelete.map((img) => img.id),
            },
            transaction: t,
          });
          console.log("Delete result:", deleteResult);
        }
        // Tambah gambar baru
        const newImages = images.filter((img) => !img.id && img.imageUrl);
        console.log("New images to add:", newImages.length);

        if (newImages.length > 0) {
          const imageData = newImages.map((img) => ({
            bookId: id,
            imageUrl: img.imageUrl,
            public_id: img.public_id || null,
          }));
          await BookImage.bulkCreate(imageData, { transaction: t });
        }
      }

      console.log("=== END DEBUG IMAGES ===");

      await t.commit();
      return res.status(200).json({
        message: "Book and images updated successfully",
      });
    } catch (error) {
      await t.rollback();
      console.log("Error: ", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async deleteBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id, { transaction: t });
      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "Book not found" });
      }
      await book.setGenres([], { transaction: t });
      const bookImages = await BookImage.findAll({
        where: { bookId: id },
        attributes: ["id", "public_id", "imageUrl"],
        transaction: t,
      });

      console.log(`Found ${bookImages.length} images to delete`);
      if (bookImages.length > 0) {
        console.log("Deleting from Cloudinary...");
        await Promise.all(
          bookImages.map((img) => deleteFromCloudinary(img.imageUrl))
        );

        console.log("Deleting images from database...");
        await BookImage.destroy({
          where: { bookId: id },
          transaction: t,
        });
      }

      console.log("Deleting book from database...");
      const result = await Book.destroy({
        where: { id },
        transaction: t,
      });

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Book deleted successfully",
        result,
      });
    } catch (error) {
      await t.rollback();
      console.error("Delete book error:", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
};
