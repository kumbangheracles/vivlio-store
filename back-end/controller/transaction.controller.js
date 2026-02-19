const { sequelize } = require("../config/database");
const { Book, UserPurchases, BookImage } = require("../models/index");
const { generateId } = require("../utils/generateId");
const { Op } = require("sequelize");

module.exports = {
  async getAll(req, res) {
    const {
      page = 1,
      limit,
      status,
      title,
      sortPrice,
      sortDateOrders,
      userId,
    } = req.query;
    const parsedLimit = limit ? parseInt(limit) : 0;
    const offset = (page - 1) * parsedLimit;

    const filters = { userId };

    if (status) {
      filters.paymentStatus = status;
    }

    if (sortDateOrders) {
      filters.purchaseDate = {
        [Op.between]: [
          new Date(`${sortDateOrders} 00:00:00`),
          new Date(`${sortDateOrders} 23:59:59`),
        ],
      };
    }

    // if (title) {
    //   if (!filters.book) {
    //     filters.book = {};
    //   }
    //   filters.book = {
    //     ...filters.book,
    //     title: { [Op.like]: `%${title}%` },
    //   };
    // }
    console.log("Full query: ", req.query);
    try {
      const total = await UserPurchases.count({
        where: filters,
      });
      console.log(total);

      const rows = await UserPurchases.findAll({
        limit: parsedLimit,
        where: filters,
        //  order: order,
        subQuery: false,
        distinct: true,
        include: [
          {
            as: "book",
            model: Book,
            required: true,
            attributes: ["title", "author", "price"],
            where: title ? { title: { [Op.like]: `%${title}%` } } : undefined,
            include: [
              {
                model: BookImage,
                as: "images",
                required: true,
                attributes: ["id", "imageUrl", "public_id"],
              },
            ],
          },
        ],

        offset,
      });

      const results = rows.map((order) => {
        const orderJson = order.toJSON();

        const purchaseDate = new Date(orderJson.purchaseDate).getTime();

        const expiryTime = new Date(purchaseDate + 1 * 60 * 1000);

        return {
          ...orderJson,
          expiry_time: expiryTime,
        };
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: results,
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
