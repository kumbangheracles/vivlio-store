const { Worker } = require("bullmq");
const connection = require("../queues/connection.queue");
const sendEmail = require("../utils/mailer");

const emailWorker = new Worker(
  "email",
  async (job) => {
    if (job.name === "transaction-success") {
      const { email, transactionId, total } = job.data;
      await sendEmail({
        to: email,
        subject: `Transaksi #${transactionId} berhasil`,
        template: "transaction-success",
        data: { transactionId, total },
      });
    }
  },
  { connection, concurrency: 5 },
);

emailWorker.on("completed", (job) => console.log(`Job ${job.id} selesai`));
emailWorker.on("failed", (job, err) =>
  console.error(`Job ${job.id} gagal:`, err.message),
);

module.exports = emailWorker;
