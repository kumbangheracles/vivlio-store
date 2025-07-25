const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const genreController = require("../controller/genre.controller");
// Get all Genres
router.get("/", [authMiddleware, checkRole(["admin"])], genreController.getAll);

router.get(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  genreController.getOne
);

// Create Genre
router.post(
  "/",
  [authMiddleware, checkRole(["admin"])],
  genreController.createGenre
);

// Update Genre
router.patch(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  genreController.updateGenre
);

// Delete Genre
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  genreController.deleteGenre
);

module.exports = router;
