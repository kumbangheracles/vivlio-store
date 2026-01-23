require("dotenv").config();
const app = require("./app");
const { sequelize, connectDB } = require("./config/database");

require("./jobs/cleanUpUnverifiedUsers");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
})();
