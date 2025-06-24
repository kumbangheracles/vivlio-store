require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/database");
const bookRoutes = require("./routes/book");
const path = require("path");
const imageRoutes = require("./routes/image");
const userRoutes = require("./routes/user");
const BookCategoryRoutes = require("./routes/book_category");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { swaggerUi, specs } = require("./docs/swagger");
const bodyParser = require("body-parser");

require("./jobs/cleanUpUnverifiedUsers");
async function init() {
  try {
    const app = express();
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:5173");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      next();
    });

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(express.json());
    app.use(bodyParser.json());
    const port = 3000;

    // Connect to database
    await connectDB();

    // Sync models (ensure tables exist)
    await sequelize.sync().then(() => console.log("Database synced"));

    // Routes
    app.use("/books", bookRoutes);

    app.use("/books/uploads", express.static("uploads"));

    app.use("/images", imageRoutes);

    app.use("/users", userRoutes);

    app.use("/book-category", BookCategoryRoutes);

    app.use("/auth", authRoutes);

    app.get("/", (req, res) => {
      res.json({
        message: "success",
        docs: "",
      });
    });

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    });
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

init();
