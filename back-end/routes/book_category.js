const express = require("express");
const BookCategory = require("../models/book_category");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
router.get("/", async (req, res) => {
  const { isPopular, title, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (isPopular !== undefined) {
    filters.isPopular = isPopular === "true" || isPopular === "1";
  }
  if (title) {
    filters.title = { [Op.like]: `%${title}%` };
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const { count, rows } = await BookCategory.findAndCountAll({
      where: filters,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
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
});

router.get("/:categoryId", async (req, res) => {
  try {
    const book_category = await BookCategory.findOne({
      where: { categoryId: req.params.categoryId },
    });
    res.status(200).json(book_category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", [authMiddleware, checkRole(["admin"])], async (req, res) => {
  try {
    const book_category = await BookCategory.create(req.body);
    res.status(200).json(book_category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/:categoryId",
  [authMiddleware, checkRole(["admin"])],
  async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { status } = req.body;
      if (typeof status !== "boolean") {
        return res.status(400).json({ error: "Invalid status" });
      }
      await BookCategory.update(req.body, { where: { categoryId } });

      const updated = await BookCategory.findByPk(categoryId);

      res.status(200).json({
        result: updated,
        message: "Category updated successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:categoryId",
  [authMiddleware, checkRole(["admin"])],
  async (req, res) => {
    try {
      const { categoryId } = req.params;
      await BookCategory.destroy({ where: { categoryId } });
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
