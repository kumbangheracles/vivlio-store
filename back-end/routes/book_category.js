const express = require("express");
const { BookCategory, CategoryImage } = require("../models/index");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { sequelize } = require("../config/database");
const { deleteFromCloudinary } = require("../helpers/deleteCoudinary");
router.get("/public", async (req, res) => {
  const { isPopular, title } = req.query;

  const filters = {};
  if (isPopular !== undefined) {
    filters.isPopular = isPopular === "true" || isPopular === "1";
  }
  if (title) {
    filters.title = { [Op.like]: `%${title}%` };
  }

  try {
    const allCategory = await BookCategory.findAll({
      where: filters,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CategoryImage,
          as: "categoryImage",
          attributes: ["id", "imageUrl", "public_id"],
        },
      ],
    });

    res.status(200).json({
      status: "Success",
      results: allCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
      data: [],
    });
  }
});

router.get(
  "/get-all",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  async (req, res) => {
    try {
      if (!req.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const allCategory = await BookCategory.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: CategoryImage,
            as: "categoryImage",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
      });

      res.status(200).json({
        status: "Success",
        results: allCategory,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

router.get(
  "/",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  async (req, res) => {
    const { isPopular, title, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }
    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }
    const whereCondition = req.id
      ? { ...filters, createdByAdminId: req.id }
      : filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
      const { count, rows } = await BookCategory.findAndCountAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        distinct: true,
        include: [
          {
            model: CategoryImage,
            as: "categoryImage",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
        offset,
      });

      res.status(200).json({
        status: "Success",
        results: rows,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

router.get("/:categoryId", async (req, res) => {
  try {
    const book_category = await BookCategory.findOne({
      where: { categoryId: req.params.categoryId },
      include: [
        {
          model: CategoryImage,
          as: "categoryImage",
          attributes: ["id", "imageUrl", "public_id"],
        },
      ],
    });
    res.status(200).json(book_category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.single("categoryImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { categoryImage } = req.body;
      const parsedImages =
        typeof categoryImage === "string"
          ? JSON.parse(categoryImage)
          : categoryImage;
      console.log("Data img: ", categoryImage);
      const imageArray = [].concat(parsedImages || []);
      const book_category = await BookCategory.create(
        {
          ...req.body,
          createdByAdminId: req.id,
        },
        { transaction: t },
      );

      const categoryImageData = imageArray.map((img) => ({
        categoryId: book_category.categoryId,
        imageUrl: img.imageUrl,
        public_id: img.public_id,
      }));

      await CategoryImage.bulkCreate(categoryImageData, { transaction: t });
      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Success create category",
        result: {
          ...book_category.toJSON(),
          categoryImage: categoryImageData,
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
  },
);

router.patch(
  "/:categoryId",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.single("categoryImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      const { status } = req.body;
      let categoryImage = req.body.categoryImage;

      const category = await BookCategory.findByPk(categoryId, {
        transaction: t,
      });

      if (!category) {
        await t.rollback();
        return res.status(404).json({ message: "Category not found" });
      }

      if (typeof status !== "boolean") {
        return res.status(400).json({ error: "Invalid status" });
      }
      await BookCategory.update({ ...req.body }, { where: { categoryId } });

      if (typeof categoryImage === "string") {
        try {
          categoryImage = JSON.parse(categoryImage);
          console.log("Parsed categoryImage:", categoryImage);
        } catch (err) {
          console.error("Gagal parse categoryImage:", err.message);
          categoryImage = null;
        }
      }

      if (Array.isArray(categoryImage) && categoryImage.length === 1) {
        categoryImage = categoryImage[0];
      }
      if (typeof categoryImage === "object" && categoryImage !== null) {
        const existingImage = await CategoryImage.findOne({
          where: { categoryId: categoryId },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });

        if (categoryImage.id && categoryImage.imageUrl) {
          console.log("Updating existing image:", categoryImage.id);
          await CategoryImage.update(
            {
              imageUrl: categoryImage.imageUrl,
              public_id: categoryImage.public_id || null,
            },
            {
              where: { id: categoryImage.id, categoryId: categoryId },
              transaction: t,
            },
          );
        } else if (!categoryImage.id && categoryImage.imageUrl) {
          console.log("Adding new Category image");
          await CategoryImage.create(
            {
              categoryId: categoryId,
              imageUrl: categoryImage.imageUrl,
              public_id: categoryImage.public_id || null,
            },
            { transaction: t },
          );

          if (existingImage) {
            console.log("Deleting old image:", existingImage.id);
            await deleteFromCloudinary(existingImage.imageUrl);
            await CategoryImage.destroy({
              where: { id: existingImage.id },
              transaction: t,
            });
          }
        } else {
          console.warn("Image tidak valid, tidak diproses.");
        }
      } else {
        console.warn("categoryImage is null or not an object.");
      }

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Category updated successfully",
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

router.delete(
  "/:categoryId",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      const category = await BookCategory.findByPk(categoryId, {
        transaction: t,
      });

      if (!category) {
        await t.rollback();
        return res.status(404).json({
          status: 404,
          message: "Category not found",
          result: null,
        });
      }

      const categoryImage = await CategoryImage.findAll({
        where: { categoryId: categoryId },
        attributes: ["id", "public_id", "imageUrl"],
        transaction: t,
      });
      console.log(`Found ${categoryImage.length} images to delete`);

      if (categoryImage.length > 0) {
        console.log("Deleting from Cloudinary...");
        await Promise.all(
          categoryImage.map((img) => deleteFromCloudinary(img.imageUrl)),
        );

        console.log("Deleting images from database...");
        await BookCategory.destroy({
          where: { categoryId: categoryId },
          transaction: t,
        });
      }
      await t.commit();

      res
        .status(200)
        .json({ status: 200, message: "Book deleted successfully" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

module.exports = router;
