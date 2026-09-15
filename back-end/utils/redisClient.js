const { createClient } = require("redis");
const redisClient = createClient({ url: "redis://localhost:6380" });
redisClient.connect().catch(console.error);
module.exports = redisClient;
