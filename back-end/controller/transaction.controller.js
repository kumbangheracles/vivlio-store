const userPurchases = require("../models/userPurchases");
const { sequelize } = require("../config/database");
const { Book } = require("../models");

module.exports = {
  async getAll(req, res) {
    const { page = 1, limit, status } = req.query;
    const parsedLimit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * parsedLimit;

    const filters = {};

    try {
      const total = await userPurchases.count({
        where: filters,
        // include: [{model: Book, required: true, through: {attributes: ['bookImage', 'title', 'author', '']}}]
      });

      const rows = await userPurchases.findAll({
        limit: parsedLimit,
        where: filters,
        //  order: order,
        include: [
          {
            model: Book,
            required: true,
            through: { attributes: ["bookImage", "title", "author", ""] },
          },
        ],

        offset,
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: rows,
        total: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parsedLimit),
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
