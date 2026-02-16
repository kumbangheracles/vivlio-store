const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, transactionController.getAll);

module.exports = router;
