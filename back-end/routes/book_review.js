const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const bookReviewsController = require("../controller/bookreview.controller");
// Get all Book Reviews
router.get("/", authMiddleware, bookReviewsController.getAllReview);

// Get One Book Reviews
router.get(
  "/:id",
  checkRole(["admin", "super_admin"]),
  bookReviewsController.getOneReview,
);

// Create Book Reviews
router.post("/:bookId", authMiddleware, bookReviewsController.createReview);

// Update Book Reviews
router.patch("/:id", authMiddleware, bookReviewsController.updateReview);

// Delete Book Reviews
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookReviewsController.deleteReview,
);

module.exports = router;
