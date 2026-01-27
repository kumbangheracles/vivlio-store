const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const bookController = require("../controller/book.controller");
// Get all books
router.get("/", authMiddleware, bookController.getAll);

router.get("/client", authMiddleware, bookController.getAllClient);

router.get("/common-all", bookController.getAllCommon);

// Cms get All Books
router.get(
  "/admin",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookController.cmsGetAll,
);

router.get("/:id", authMiddleware, bookController.getOne);

// Create book
router.post(
  "/",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.multiple("images"),
  ],
  bookController.createBook,
);

// Update book
router.patch(
  "/:id",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.multiple("images"),
  ],
  bookController.updateBook,
);

// add and remove wishlist

// Delete book
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  bookController.deleteBook,
);

module.exports = router;
