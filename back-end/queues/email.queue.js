const { Queue } = require("bullmq");
const connection = require("./connection.queue");

const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

module.exports = emailQueue;
