const express = require("express");
const Book = require("../models/books");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const bookController = require("../controller/book.controller");
// Get all books
router.get("/", bookController.getAll);

router.get(
  "/:id",

  bookController.getOne
);

// Create book
router.post(
  "/",
  [authMiddleware, checkRole(["admin"]), uploadMiddleware.multiple("images")],
  bookController.createBook
);

// Update book
router.patch(
  "/:id",
  [authMiddleware, checkRole(["admin"]), uploadMiddleware.multiple("images")],
  bookController.updateBook
);

// Delete book
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  bookController.deleteBook
);

module.exports = router;
