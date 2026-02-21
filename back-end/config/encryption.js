const crypto = require("crypto");

const encrypt = (password) => {
  const encrypted = crypto
    .pbkdf2Sync(password, process.env.ACCESS_TOKEN, 1000, 64, "sha512")
    .toString("hex");
  return encrypted;
};

module.exports = { encrypt };
