const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const toDataURL = (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURL = `data:${file.mimetype};base64,${b64}`;
  return dataURL;
};

const getPublicIdFromFileUrl = (fileUrl) => {
  const fileNameUsingSubstring = fileUrl.substring(
    fileUrl.lastIndexOf("/") + 1
  );
  const publicId = fileNameUsingSubstring.substring(
    0,
    fileNameUsingSubstring.lastIndexOf(".")
  );
  return publicId;
};

const uploader = {
  async uploadSingle(file) {
    const fileDataURL = toDataURL(file);
    const result = await cloudinary.uploader.upload(fileDataURL, {
      resource_type: "auto",
    });
    return result;
  },

  async uploadMultiple(files) {
    const uploadBatch = files.map((item) => this.uploadSingle(item));
    const results = await Promise.all(uploadBatch);
    return results;
  },

  async remove(fileUrl) {
    const publicId = getPublicIdFromFileUrl(fileUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  },
};

module.exports = uploader;
