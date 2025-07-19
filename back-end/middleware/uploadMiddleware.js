const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = {
  single: (fieldName) => upload.single(fieldName),
  multiple: (fieldName) => upload.array(fieldName),
};
