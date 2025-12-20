const {
  UserCart,
  Book,
  BookStats,
  BookImage,
  Genre,
  User,
} = require("../models/index");
const { Op } = require("sequelize");
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

  async updateQuantityBook(req, res) {
    try {
      const userId = req.id;
      const { id } = req.params;
      const { type } = req.body; // 'add' | 'remove'
      console.log("CART ID:", id);
      console.log("USER ID:", userId);
      console.log("Type:", type);

      if (!userId) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "Cart item id is required",
        });
      }

      if (!["add", "remove"].includes(type)) {
        return res.status(400).json({
          status: 400,
          message: "Type must be 'add' or 'remove'",
        });
      }

      const cartItem = await UserCart.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!cartItem) {
        return res.status(404).json({
          status: 404,
          message: "Cart item not found",
        });
      }

      let newQty = cartItem.quantity;

      if (type === "add") {
        newQty += 1;
      } else if (type === "remove") {
        newQty = Math.max(1, newQty - 1);
      }

      console.log("Berhasil update quantity");

      cartItem.quantity = newQty;
      await cartItem.save();

      res.status(200).json({
        status: 200,
        message: "Quantity updated successfully",
        results: {
          id: cartItem.id,
          bookId: cartItem.bookId,
          quantity: cartItem.quantity,
        },
      });
    } catch (error) {
      console.error("UPDATE CART QUANTITY ERROR:", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },

  async getAllCartedBook(req, res) {
    try {
      const userId = req.id;

      if (!userId) {
        return res.status(400).json({ status: 400, message: "Unauthorized" });
      }

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
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Book,
            as: "cartBooks",
            through: { attributes: ["quantity", "id"] },
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
        results: user?.cartBooks || [],
      });
    } catch (error) {
      console.error("GET CART ERROR:", error);
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

      if (!bookId) {
        return res
          .status(404)
          .json({ status: 404, message: "Book id not found in cart" });
      }

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
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async bulkRemoveFromCart(req, res) {
    try {
      const userId = req.id;
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "No IDs Provided" });
      }

      const result = await UserCart.destroy({
        where: { id: { [Op.in]: ids }, userId },
      });

      res.status(200).json({
        status: 200,
        message: "Bulk remove cart success",
        result,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
};
