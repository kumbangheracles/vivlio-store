const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const genreController = require("../controller/genre.controller");
// Get all Genres
router.get(
  "/",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  genreController.getAll
);

router.get(
  "/public",

  genreController.publicGetAll
);
router.get(
  "/:genreId",

  genreController.getOne
);

// Create Genre
router.post(
  "/",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  genreController.createGenre
);

// Update Genre
router.patch(
  "/:genreId",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  genreController.updateGenre
);

// Delete Genre
router.delete(
  "/:genreId",
  [authMiddleware, checkRole(["admin", "super_admin"])],
  genreController.deleteGenre
);

module.exports = router;
