const express = require("express");
const { BookCategory, CategoryImage } = require("../models/index");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { sequelize } = require("../config/database");
const { deleteFromCloudinary } = require("../helpers/deleteCoudinary");
const { Op, or } = require("sequelize");
router.get("/public", async (req, res) => {
  const { isPopular, title, isSuggested, sortDate } = req.query;

  const filters = {};
  if (isPopular !== undefined) {
    filters.isPopular = isPopular === "true" || isPopular === "1";
  }

  if (isSuggested !== undefined) {
    filters.isSuggested = isSuggested === "true" || isSuggested === "1";
  }
  if (title) {
    filters.title = { [Op.like]: `%${title}%` };
  }
  let order = [];

  if (sortDate === "newest_saved") {
    order.push(["createdAt", "DESC"]);
  }

  if (sortDate === "oldest_saved") {
    order.push(["createdAt", "ASC"]);
  }
  try {
    const allCategory = await BookCategory.findAll({
      where: filters,
      order: order,
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
    const {
      isPopular,
      name,
      page = 1,
      limit = 10,
      isSuggested,
      status,
      sortDate,
    } = req.query;

    const parsedLimit = parseInt(limit);

    const filters = {};
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }
    if (name) {
      filters.name = { [Op.like]: `%${name}%` };
    }
    if (isSuggested !== undefined) {
      filters.isSuggested = isSuggested === "true" || isSuggested === "1";
    }
    if (status !== undefined) {
      filters.status = status === "true" || status === "1";
    }
    const whereCondition = req.id
      ? { ...filters, createdByAdminId: req.id }
      : filters;
    const offset = (parseInt(page) - 1) * parsedLimit;

    console.log("Full Query Category =======: ", req.query);
    try {
      let order = [];
      if (sortDate === "newest_saved") {
        order.push(["createdAt", "DESC"]);
      }

      if (sortDate === "oldest_saved") {
        order.push(["createdAt", "ASC"]);
      }
      const { count, rows } = await BookCategory.findAndCountAll({
        where: whereCondition,
        order: order,
        limit: parsedLimit,
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
        totalPages: Math.ceil(count / parsedLimit),
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
      const { status, isSuggested } = req.body;
      let categoryImage = req.body.categoryImage;

      if (isSuggested === true) {
        const allCatSuggested = await BookCategory.count({
          where: { isSuggested: true },
        });

        if (allCatSuggested >= 6) {
          return res.status(405).json({
            message: "Suggested category maximum 6.",
          });
        }
      }

      const category = await BookCategory.findByPk(categoryId, {
        transaction: t,
      });

      if (!category) {
        await t.rollback();
        return res.status(404).json({ message: "Category not found" });
      }

      if (
        (status !== undefined && typeof status !== "boolean") ||
        (isSuggested !== undefined && typeof isSuggested !== "boolean")
      ) {
        return res.status(400).json({
          error: "Invalid type for status or isSuggested",
        });
      }
      const result = await BookCategory.update(
        { ...req.body },
        { where: { categoryId } },
      );

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
        result: result,
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
