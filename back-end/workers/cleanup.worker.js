const { Worker } = require("bullmq");
const connection = require("../queues/connection.queue");
const User = require("../models/user");
const { Op } = require("sequelize");

const EXPIRATION_TIME_MINUTES = 1;

const cleanupWorker = new Worker(
  "cleanup",
  async (job) => {
    console.log(
      `[worker] job diterima: ${job.name} at ${new Date().toISOString()}`,
    );
    if (job.name === "delete-unverified-users") {
      const expirationDate = new Date(
        Date.now() - EXPIRATION_TIME_MINUTES * 60 * 1000,
      );
      console.log(
        `[worker] cek user dengan verificationCodeCreatedAt <`,
        expirationDate,
      );

      const deletedCount = await User.destroy({
        where: {
          isVerified: false,
          verificationCodeCreatedAt: { [Op.lt]: expirationDate },
        },
      });

      console.log(`[worker] deletedCount:`, deletedCount);
      return { deletedCount };
    }
  },
  { connection, concurrency: 1 },
);

cleanupWorker.on("completed", (job, result) =>
  console.log(`[worker] job ${job.id} completed`, result),
);
cleanupWorker.on("failed", (job, err) =>
  console.error(`Job ${job.id} (${job.name}) gagal:`, err.message),
);
cleanupWorker.on("error", (err) =>
  console.error(`[worker] connection/error:`, err),
); // ini yang paling sering kelewat

cleanupWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} (${job.name}) gagal:`, err.message);
});

console.log("[worker] Worker instance dibuat, listening on queue 'cleanup'");
module.exports = cleanupWorker;
