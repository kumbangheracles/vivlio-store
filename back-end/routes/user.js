const express = require("express");
const router = express.Router();
const { User, UserImage } = require("../models/index");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const uploader = require("../config/uploader");
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
            attributes: ["id", "imageUrl", "public_id"],
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

router.post(
  "/",
  [authMiddleware, checkRole("admin"), uploadMiddleware.single("profileImage")],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { fullName, username, email, password, roleId } = req.body;

      // Ambil files dari multer
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: "Profile image must be uploaded.",
        });
      }

      // Upload ke Cloudinary
      const uploadedImage = await uploader.uploadSingle(file);

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
      await UserImage.bulkCreate(
        {
          userId: user.id,
          imageUrl: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        },
        { transaction: t }
      );

      await t.commit();

      res.status(201).json({
        status: 201,
        message: "Success create user",
        result: {
          ...user.toJSON(),
          profileImage: {
            userId: user.id,
            imageUrl: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
          },
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

/** case untuk handle dari front-end
 * 
 * 
 * router.post(
  "/",
  [authMiddleware, checkRole("admin")],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { fullName, username, email, password, roleId, profileImage } = req.body;

      // Pastikan profileImage valid
      const parsedImages = typeof profileImage === "string" ? JSON.parse(profileImage) : profileImage;

      if (!Array.isArray(parsedImages) || parsedImages.length !== 1) {
        return res.status(400).json({
          message: "Exactly one profile image must be provided.",
        });
      }

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

      const profileImageData = parsedImages.map((img) => ({
        userId: user.id,
        imageUrl: img.imageUrl,
        public_id: img.public_id,
      }));

      await UserImage.bulkCreate(profileImageData, { transaction: t });

      await t.commit();

      res.status(201).json({
        status: 201,
        message: "Success create user",
        result: {
          ...user.toJSON(),
          profileImage: profileImageData,
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

 * 
 * 
 */

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

module.exports = router;
