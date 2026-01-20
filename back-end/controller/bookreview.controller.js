const { BookReview, Book, User } = require("../models/index");
module.exports = {
  async getAllReview(req, res) {
    try {
      const bookReviews = await BookReview.findAll({
        include: {
          model: Book,
          as: "book",
          attributes: ["id", "title"],
        },
        include: {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: bookReviews,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async getOneReview(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "review not found",
        });
      }
      const result = await BookReview.findOne({
        where: { id },
        include: {
          model: Book,
          as: "book",
          attributes: ["id", "title"],
        },
        include: {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async createReview(req, res) {
    try {
      const { bookId } = req.params;

      if (!bookId) {
        return res.status(400).json({
          status: 400,
          message: "bookId not found",
        });
      }
      await BookReview.create({
        ...req.body,
        bookId: bookId,
        userId: req.id,
      });

      res.status(200).json({
        status: 200,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async updateReview(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "review not found",
        });
      }

      await BookReview.update(req.body, { where: { id } });

      res.status(200).json({
        status: 200,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "review not found",
        });
      }

      await BookReview.destroy({ where: { id } });

      res.status(200).json({
        status: 200,
        message: "Success",
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
