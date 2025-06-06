function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getCodeExpirationTime(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = {
  generateVerificationCode,
  getCodeExpirationTime,
};
