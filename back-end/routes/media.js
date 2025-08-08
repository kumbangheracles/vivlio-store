const mediaController = require("../controller/media.controller");

const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

router.post(
  "/upload-single",
  [
    authMiddleware,
    checkRole(["admin", "customer", "super_admin"]),
    uploadMiddleware.single("file"),
  ],

  mediaController.single
);
router.post(
  "/upload-multiple",
  [
    authMiddleware,
    checkRole(["admin", "customer", "super_admin"]),
    uploadMiddleware.multiple("files"),
  ],
  mediaController.multiple
);
router.delete(
  "/remove",
  authMiddleware,
  checkRole(["admin", "customer", "super_admin"]),
  mediaController.remove
);

module.exports = router;
