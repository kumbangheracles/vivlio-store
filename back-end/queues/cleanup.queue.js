const { Queue } = require("bullmq");
const connection = require("./connection.queue");

const cleanupQueue = new Queue("cleanup", { connection });

module.exports = cleanupQueue;
