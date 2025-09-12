const {
  UserWishlist,
  Book,
  BookStats,
  BookImage,
  Genre,
} = require("../models/index");
const { updateBookPopularity } = require("../helpers/updatePopularityBook");
module.exports = {
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.id;
      const book = await Book.findOne({
        where: { id },
        include: [
          { model: BookStats, as: "stats" },
          { model: BookImage, as: "images" },
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });

      if (!book) {
        return res.status(404).json({
          status: 404,
          message: "Book not found",
        });
      }

      let isWishlisted = false;
      if (userId) {
        const exist = await UserWishlist.findOne({
          where: { userId, bookId: id },
        });
        isWishlisted = !!exist;
      }

      res.status(200).json({
        status: 200,
        message: "Success",
        result: {
          ...book.toJSON(),
          isWishlisted,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },
  async getAllWishlist(req, res) {
    try {
      const userId = req.id;

      const wishlist = await UserWishlist.findAll({
        where: { userId },
        include: [
          {
            model: Book,
            as: "book",
            include: [
              { model: BookStats, as: "stats" },
              { model: BookImage, as: "images" },
              { model: Genre, as: "genres", through: { attributes: [] } },
            ],
          },
        ],
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: wishlist,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async addToWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.body;

      const exist = await UserWishlist.findOne({ where: { userId, bookId } });
      if (exist) {
        return res
          .status(400)
          .json({ status: 400, message: "Book already in wishlist" });
      }

      await UserWishlist.create({ userId, bookId });
      await updateBookPopularity(bookId);
      res.status(200).json({
        status: 200,
        message: "Success Add to wishlist",
        // result: wishlist,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async removeFromWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.params;

      const deleted = await UserWishlist.destroy({ where: { userId, bookId } });
      if (!deleted) {
        return res
          .status(404)
          .json({ status: 404, message: "Book not found in wishlist" });
      }

      res.status(200).json({
        status: 200,
        message: "Removed from wishlist success",
      });
    } catch (errror) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async toggleWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.body;

      const exist = await UserWishlist.findOne({ where: { userId, bookId } });

      if (exist) {
        await UserWishlist.destroy({ where: { userId, bookId } });
        return res.status(200).json({
          status: 200,
          message: "Removed from wishlist",
          isWishlisted: false,
        });
      }

      await UserWishlist.create({ userId, bookId });
      res.status(200).json({
        status: 200,
        message: "Added to wishlist",
        isWishlisted: true,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },
};
