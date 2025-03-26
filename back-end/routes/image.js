const express = require("express");
const path = require("path");
const router = express.Router();
const Image = require("../models/images");

// Get All Image
router.get("/", async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed To Get Images", err });
  }
});

// Get image base on filename
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "../uploads", filename);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ message: "Image Not Found" });
    }
  });
});

module.exports = router;
