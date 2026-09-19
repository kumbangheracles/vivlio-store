const cleanupQueue = require("../queues/cleanup.queue");

async function scheduleDeleteUnverifiedUsers() {
  const before = await cleanupQueue.getJobSchedulers();
  console.log("[queue] Job schedulers SEBELUM upsert:", before);

  await cleanupQueue.upsertJobScheduler(
    "delete-unverified-users", // ini jadi scheduler id, ganti jobId
    { pattern: "*/1 * * * *" }, // repeat options langsung di sini
    {
      name: "delete-unverified-users", // nama job yang dibaca job.name di worker
      data: {},
    },
  );

  const after = await cleanupQueue.getJobSchedulers();
  console.log("[queue] Job schedulers SETELAH upsert:", after);
}

module.exports = scheduleDeleteUnverifiedUsers;
