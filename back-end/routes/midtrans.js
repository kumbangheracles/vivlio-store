const express = require("express");
const router = express.Router();
const midtransController = require("../controller/midtrans.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, midtransController.midtransPost);
router.post(
  "/bulk-checkout",
  authMiddleware,
  midtransController.midtransMultiCheckout
);

module.exports = router;
