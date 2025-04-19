const express = require("express");
const multer = require("multer");
const path = require("path");
const Book = require("../models/books");
const router = express.Router();

// Konfigurasi Multer untuk menyimpan file ke folder "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.post("/", upload.single("book_cover"), async (req, res) => {
  try {
    if (req.file) {
      req.body.book_cover = `http://localhost:3000/books/uploads/${req.file.filename}`;
    }
    const book = await Book.create(req.body);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put("/:id", upload.single("book_cover"), async (req, res) => {
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
