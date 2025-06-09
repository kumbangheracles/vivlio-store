const cron = require("node-cron");
const User = require("../models/user");
const { Op } = require("sequelize");

const EXPIRATION_TIME_MINUTES = 1;

cron.schedule("*/1 * * * *", async () => {
  const expirationDate = new Date(
    Date.now() - EXPIRATION_TIME_MINUTES * 60 * 1000
  );

  try {
    const deletedCount = await User.destroy({
      where: {
        isVerified: false,
        verificationCodeCreatedAt: {
          [Op.lt]: expirationDate,
        },
      },
    });

    if (deletedCount > 0) {
      console.log(`Deleted ${deletedCount} unverified user(s).`);
    }
  } catch (err) {
    console.error("Failed to delete unverified users:", err);
  }
});
