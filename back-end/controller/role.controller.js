const { Role } = require("../models");
module.exports = {
  async getAll(req, res) {
    const { page = 1, limit = 10, id } = req.query;
    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await Role.findAndCountAll({
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

  async getOne(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "Role Not Found",
          data: null,
        });
      }
      const role = await Role.findOne({
        where: { id },
      });
      res.status(200).json({
        status: 200,
        message: "Success",
        result: role,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async createRole(req, res) {
    try {
      const role = await Role.create(req.body);
      res.status(200).json({
        status: 200,
        message: "Success",
        result: role,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async updateRole(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "Role Not Found",
          data: null,
        });
      }

      await Role.update(req.body, { where: { id } });

      const updated = await Role.findByPk(id);

      res.status(200).json({
        status: 200,
        result: updated,
        message: "Role updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "Role Not Found",
          data: null,
        });
      }
      await Role.destroy({ where: { id } });
      res.status(200).json({
        status: 200,
        message: "Role deleted successfully",
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
