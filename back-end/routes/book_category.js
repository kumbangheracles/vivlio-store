const express = require("express");
const BookCategory = require("../models/book_category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const book_category = await BookCategory.findAll();
    res.json(book_category);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

router.put("/:id", async (req, res) => {
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
