const express = require("express");
const Book = require("../models/books");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const bookController = require("../controller/book.controller");
// Get all books
router.get("/", bookController.getAll);

// Cms get All Books
router.get(
  "/admin",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookController.cmsGetAll
);

router.get(
  "/:id",

  bookController.getOne
);

// Create book
router.post(
  "/",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.multiple("images"),
  ],
  bookController.createBook
);

// Update book
router.patch(
  "/:id",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.multiple("images"),
  ],
  bookController.updateBook
);

// add and remove wishlist
router.post("/update-stats/:id", authMiddleware, bookController.addToWishlist);
router.delete(
  "/update-stats/:id",
  authMiddleware,
  bookController.removeFromWishlist
);

// Delete book
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookController.deleteBook
);

module.exports = router;
