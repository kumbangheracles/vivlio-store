const uploader = require("../config/uploader");
const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;

  try {
    await uploader.remove(public_id);
    console.log(`Deleted from Cloudinary: ${public_id}`);
  } catch (error) {
    console.error(`Failed to delete from Cloudinary: ${public_id}`, error);
  }
};

module.exports = { deleteFromCloudinary };
