const express = require("express");
const BookCategory = require("../models/book_category");
const router = express.Router();

router.get("/", async (req, res) => {
  const { isPopular, title, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (isPopular !== undefined) {
    filters.isPopular = isPopular === "true" || isPopular === "1";
  }
  if (title) {
    filters.title = { [Op.like]: `%${title}%` };
  }

  const offset = (page - 1) * limit;
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

router.get("/:id", async (req, res) => {
  try {
    const book_category = await BookCategory.findOne({
      where: { id: req.params.id },
    });
    res.json(book_category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const book_category = await BookCategory.create(req.body);
    res.json(book_category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await BookCategory.update(req.body, { where: { id } });
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await BookCategory.destroy({ where: { id } });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
