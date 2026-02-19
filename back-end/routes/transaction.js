const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, transactionController.getAll);

module.exports = router;
