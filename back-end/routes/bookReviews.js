const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const bookReviewsController = require("../controller/bookreview.controller");
// Get all Book Reviews
router.get(
  "/",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookReviewsController.getAllReview,
);

// Get One Book Reviews
router.get("/:id", authMiddleware, bookReviewsController.getOneReview);

// Create Book Reviews
router.post("/", authMiddleware, bookReviewsController.createReview);

// Update Book Reviews
router.patch("/:id", authMiddleware, bookReviewsController.updateReview);

// Delete Book Reviews
router.delete("/:id", authMiddleware, bookReviewsController.deleteReview);

module.exports = router;
