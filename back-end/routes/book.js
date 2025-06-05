const express = require("express");
const Book = require("../models/books");
const router = express.Router();
// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();

    res.status(200).json({
      status: true,
      message: "Books retrieved successfully",
      payload: books,
      total: books.length, // optional
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
