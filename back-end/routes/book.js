const express = require("express");
const Book = require("../models/books");
const router = express.Router();
// Get all books
router.get("/", async (req, res) => {
  const { isPopular, title, categoryId, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (isPopular !== undefined) {
    filters.isPopular = isPopular === "true" || isPopular === "1";
  }
  if (categoryId) filters.categoryId = categoryId;
  if (title) {
    filters.title = { [Op.like]: `%${title}%` };
  }

  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Book.findAndCountAll({
      where: filters,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    res.status(200).json({
      status: "Success",
      message: "Books retrieved successfully",
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
    const book = await Book.findOne({ where: { id: req.params.id } });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create book
router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.update(req.body, { where: { id } });
    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.destroy({ where: { id } });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
