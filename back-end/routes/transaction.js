const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction.controller");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, transactionController.getAll);
router.get(
  "/admin/income",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  transactionController.getIncome,
);

module.exports = router;
