const express = require("express");
const path = require("path");
const router = express.Router();
const Image = require("../models/images");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
// add & upload image
router.post("/upload-img", upload.single("file"), (req, res) => {
  res.json(req.file);
});
// Get All Image
router.get("/all", async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed To Get Images", err });
  }
});

// Get one image by id

router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findOne({ where: { id: req.params.id } });
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: "Failed To Get Image", err });
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
