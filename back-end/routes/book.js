const express = require("express");
const Book = require("../models/book");
const router = express.Router();
const upload = require("../upload");
const Image = require("../models/image");
// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/image", async (req, res) => {
//   try {
//     const books = await Book.findAll();
//     res.send(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

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
router.put("/:id", async (req, res) => {
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

router.get("/all", async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images); // Mengirim daftar gambar dengan URL-nya
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
