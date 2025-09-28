const {
  UserCart,
  Book,
  BookStats,
  BookImage,
  Genre,
} = require("../models/index");

module.exports = {
  async getCartedBookById(req, res) {
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

      let isCarted = false;
      if (userId) {
        const exist = await UserCart.findOne({
          where: { userId, bookId: id },
        });
        isCarted = !!exist;
      }

      res.status(200).json({
        status: 200,
        message: "Success",
        result: {
          ...book.toJSON(),
          isCarted,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },

  async getAllCartedBook(req, res) {
    try {
      const userId = req.id;

      const cartedBook = await UserCart.findAll({
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
        results: cartedBook,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async addToCart(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.body;

      const exist = await UserCart.findOne({ where: { userId, bookId } });
      if (exist) {
        return res
          .status(400)
          .json({ status: 400, message: "Book already in cart" });
      }

      await UserCart.create({ userId, bookId });
      //   await updateBookPopularity(bookId);
      res.status(200).json({
        status: 200,
        message: "Success Add to cart",
        // result: cart,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async removeFromCart(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.params;

      const deleted = await UserCart.destroy({ where: { userId, bookId } });
      if (!deleted) {
        return res
          .status(404)
          .json({ status: 404, message: "Book not found in cart" });
      }

      res.status(200).json({
        status: 200,
        message: "Removed from cart success",
      });
    } catch (errror) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
};
