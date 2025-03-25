const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./image", // Folder penyimpanan lokal
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Format nama file unik
  },
});

const upload = multer({ storage });

module.exports = upload;
