const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const roleController = require("../controller/role.controller");
// Get all roles
router.get("/", roleController.getAll);

// Get One role
router.get("/:id", roleController.getOne);

// Create role
router.post(
  "/",
  [authMiddleware, checkRole(["admin"])],
  roleController.createRole
);

// Update role
router.patch(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  roleController.updateRole
);

// Delete role
router.delete(
  "/:id",
  [authMiddleware, checkRole(["admin"])],
  roleController.deleteRole
);

module.exports = router;
