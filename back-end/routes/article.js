const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const articleController = require("../controller/article.controller");

// Get all artilce
router.get("/", articleController.getAll);

// Get One article
router.get("/:id", articleController.getOne);

// Create article
router.post(
  "/",
  [authMiddleware, checkRole(["super_admin", "admin"])],
  articleController.createArticle
);

// Update article
router.patch(
  "/:id",
  [authMiddleware, checkRole(["super_admin", "admin"])],
  articleController.updateArticle
);

// Delete article
router.delete(
  "/:id",
  [authMiddleware, checkRole(["super_admin", "admin"])],
  articleController.deleteArticle
);

module.exports = router;
