const express = require("express");
const router = express.Router();
const { User, UserImage } = require("../models/index");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const { sequelize } = require("../config/database");
router.post(
  "/",
  [authMiddleware, checkRole("admin"), uploadMiddleware.single("profileImage")],
  async (req, res) => {
    const { fullName, username, email, password, roleId } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);

    if (profileImage === null) {
      return res.status(400).json({
        message: "Profile image is required.",
      });
    }

    const t = await sequelize.transaction();
    try {
      const user = await User.create(
        {
          fullName,
          username,
          email,
          password,
          roleId,
        },
        { transaction: t }
      );

      const userImage = await UserImage.create(
        {
          userId: user.id,
          imageUrl: profileImage,
        },
        { transaction: t }
      );

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Success create user",
        result: {
          ...user.toJSON(),
          profileImage: userImage,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  }
);

router.patch(
  "/:id",
  [authMiddleware, checkRole("admin"), uploadMiddleware.single("profileImage")],
  async (req, res) => {
    try {
      const t = await sequelize.transaction();
      const { id } = req.params;
      const user = await User.findByPk(id, { transaction: t });

      if (!user) {
        await t.rollback();
        return res.status(404).json({ message: "User not found" });
      }
      await User.update(req.body, { where: { id }, transaction: t });
      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  }
);

router.delete(
  "/:id",
  [authMiddleware, checkRole("admin"), uploadMiddleware.single("profileImage")],
  async (req, res) => {
    try {
      const { id } = req.params;
      await Book.destroy({ where: { id } });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/",
  authMiddleware,
  checkRole(["admin", "customer"]),
  async (req, res) => {
    const { page = 1, limit = 10, id } = req.query;
    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await User.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: UserImage,
            as: "profileImage",
            attributes: ["id", "imageUrl"],
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
  }
);

router.get(
  "/:id",
  authMiddleware,

  checkRole(["admin", "customer"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      res.status(200).json({
        status: 200,
        message: "Success",
        result: user,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  }
);

module.exports = router;
