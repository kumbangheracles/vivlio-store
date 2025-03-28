require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/database");
const bookRoutes = require("./routes/book");
const path = require("path");
const imageRoutes = require("./routes/image");
const userRoutes = require("./routes/user");
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

// Connect to database
connectDB();

// Sync models (ensure tables exist)
sequelize.sync().then(() => console.log("Database synced"));

// Routes
app.use("/books", bookRoutes);

app.use("/books/uploads", express.static("uploads"));

app.use("/books/images", imageRoutes);

app.use("/books/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "success",
    docs: "/books",
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
