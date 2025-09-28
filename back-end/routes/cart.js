const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, cartController.getAllCartedBook);
router.get("/:id", authMiddleware, cartController.getCartedBookById);
router.post("/", authMiddleware, cartController.addToCart);
router.delete("/:bookId", authMiddleware, cartController.removeFromCart);
module.exports = router;
