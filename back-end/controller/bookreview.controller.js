const {
  BookReview,
  Book,
  User,
  BookImage,
  UserImage,
} = require("../models/index");
module.exports = {
  async getAllReview(req, res) {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;
    // WHERE hanya kolom valid
    const where = {};
    if (status) {
      where.status = status;
    }

    // ORDER dipisah
    const order = [[sortBy, sortOrder.toUpperCase()]];

    console.log("Query: ", req.query);
    try {
      const { count, rows } = await BookReview.findAndCountAll({
        distinct: true,
        where,
        order,
        limit: parseInt(limit),
        include: [
          {
            model: Book,
            as: "book",
            attributes: ["id", "title"],
            required: false,
            include: [
              {
                model: BookImage,
                as: "images",
                attributes: ["id", "imageUrl", "public_id"],
              },
            ],
          },
          {
            model: User,
            as: "user",
            required: false,
            attributes: ["id", "username"],
            include: [
              {
                model: UserImage,
                as: "profileImage",
                attributes: ["id", "imageUrl", "public_id"],
              },
            ],
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
      const userId = req.id;

      if (!bookId) {
        return res.status(400).json({
          status: 400,
          message: "bookId not found",
        });
      }

      const totalReview = await BookReview.count({
        where: {
          bookId,
          userId,
        },
      });

      if (totalReview >= 3) {
        return res.status(403).json({
          status: 403,
          message: "You can only create up to 3 reviews for this book",
        });
      }

      await BookReview.create({
        ...req.body,
        bookId,
        userId,
      });

      res.status(201).json({
        status: 201,
        message: "Success create review",
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
