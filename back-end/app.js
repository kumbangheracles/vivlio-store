require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/database");
const bookRoutes = require("./routes/book");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Sync models (ensure tables exist)
sequelize.sync().then(() => console.log("Database synced"));

// Routes
app.use("/books", bookRoutes);
app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.listen(3000, () => console.log("Server running on port 3000"));
