const { Book, UserPurchases, BookImage } = require("../models/index");
const { Op, fn, col, literal } = require("sequelize");
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

        const expiryTime = new Date(purchaseDate + 2 * 60 * 1000);

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

  async getIncome(req, res) {
    const { type, date } = req.query;

    try {
      if (type === "weekly") {
        const startOfWeek = new Date(date);
        const endOfWeek = new Date(date);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const data = await UserPurchases.findAll({
          attributes: [
            [fn("DATE", col("purchaseDate")), "date"],
            [fn("SUM", col("priceAtPurchases")), "totalIncome"],
          ],
          where: {
            paymentStatus: "PAID",
            purchaseDate: {
              [Op.between]: [startOfWeek, endOfWeek],
            },
          },
          group: [literal("DATE(purchaseDate)")],
          order: [[literal("DATE(purchaseDate)"), "ASC"]],
        });

        return res.json(data);
      }

      if (type === "monthly") {
        const startOfMonth = new Date(`${date}-01`);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        const total = await UserPurchases.findOne({
          attributes: [[fn("SUM", col("priceAtPurchases")), "totalIncome"]],
          where: {
            paymentStatus: "PAID",
            purchaseDate: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        });

        return res.json(total);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
