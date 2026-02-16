const express = require("express");
const router = express.Router();
const midtransController = require("../controller/midtrans.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, midtransController.midtransPost);
router.post(
  "/bulk-checkout",
  authMiddleware,
  midtransController.midtransMultiCheckout,
);
router.post("/webhook", midtransController.midtransWebhook);
router.post(
  "/cancel-payment",
  authMiddleware,
  midtransController.cancelPayment,
);
router.get(
  "/detail-order/:orderId",
  authMiddleware,
  midtransController.getMidtransOrderDetail,
);

module.exports = router;
