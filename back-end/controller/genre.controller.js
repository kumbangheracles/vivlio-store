const { where } = require("sequelize");
const Genre = require("../models/genre");

module.exports = {
  async publicGetAll(req, res) {
    const { page = 1, limit = 10, genreId } = req.query;

    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Genre.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
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
  async getAll(req, res) {
    const { page = 1, limit = 10, genreId } = req.query;

    const offset = (page - 1) * limit;
    // const whereCondition = req.id
    //   ? { ...filters, createdByAdminId: req.id }
    //   : filters;
    try {
      const { count, rows } = await Genre.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        distinct: true,
        offset,
      });

      const rowsWithAdminId = rows.filter(
        (item) => item.createdByAdminId === req.id,
      );

      res.status(200).json({
        where: req.id.length > 0,
        status: 200,
        message: "Success",
        results: rowsWithAdminId,
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
      const { genreId } = req.params;

      if (!genreId) {
        return res.status(400).json({
          status: 400,
          message: "Genre Not Found",
          data: null,
        });
      }
      const genre = await Genre.findOne({
        where: { genreId },
      });
      res.status(200).json({
        status: 200,
        message: "Success",
        result: genre,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async createGenre(req, res) {
    try {
      const genre = await Genre.create({
        ...req.body,
        createdByAdminId: req.id,
      });
      res.status(200).json({
        status: 200,
        message: "Success",
        result: genre,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async updateGenre(req, res) {
    try {
      const { genreId } = req.params;

      if (!genreId) {
        return res.status(400).json({
          status: 400,
          message: "Genre Not Found",
          data: null,
        });
      }

      await Genre.update(req.body, { where: { genreId } });

      const updated = await Genre.findByPk(genreId);

      res.status(200).json({
        status: 200,
        result: updated,
        message: "Genre updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async deleteGenre(req, res) {
    try {
      const { genreId } = req.params;
      if (!genreId) {
        return res.status(400).json({
          status: 400,
          message: "Genre Not Found",
          data: null,
        });
      }
      await Genre.destroy({ where: { genreId } });
      res.status(200).json({
        status: 200,
        message: "Genre deleted successfully",
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
