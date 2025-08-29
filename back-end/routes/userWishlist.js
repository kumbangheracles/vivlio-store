const express = require("express");
const router = express.Router();
const userWishlistController = require("../controller/wishlist.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, userWishlistController.getAllWishlist);
router.get("/:id", authMiddleware, userWishlistController.getBookById);
router.post("/", authMiddleware, userWishlistController.addToWishlist);
router.delete(
  "/:bookId",
  authMiddleware,
  userWishlistController.removeFromWishlist
);
module.exports = router;
