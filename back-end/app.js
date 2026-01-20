require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/database");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const BookCategoryRoutes = require("./routes/book_category");
const bookReviewsRoutes = require("./routes/bookReviews");
const genresRoutes = require("./routes/genre");
const rolesRoutes = require("./routes/role");
const authRoutes = require("./routes/auth");
const userWishlistRoutes = require("./routes/userWishlist");
const userCartRoutes = require("./routes/cart");
const midtransRoutes = require("./routes/midtrans");
const mediaRoutes = require("./routes/media");
const articleRoutes = require("./routes/article");
const cookieParser = require("cookie-parser");
const { swaggerUi, specs } = require("./docs/swagger");
const bodyParser = require("body-parser");

require("./jobs/cleanUpUnverifiedUsers");
async function init() {
  try {
    const app = express();
    // app.use((req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    //   res.header("Access-Control-Allow-Credentials", "true");
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    //   );
    //   res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET, POST, PUT, DELETE, OPTIONS"
    //   );
    //   next();
    // });

    app.use(
      cors({
        origin: (origin, callback) => {
          const allowedOrigins = [
            "http://localhost:3002",
            "http://localhost:3001",
            "http://localhost:3000",
          ];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      }),
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
    app.use("/auth", authRoutes);
    app.use("/books", bookRoutes);
    app.use("/book-reviews", bookReviewsRoutes);
    app.use("/userWishlist", userWishlistRoutes);

    app.use("/cart", userCartRoutes);

    app.use("/users", userRoutes);

    app.use("/book-category", BookCategoryRoutes);

    app.use("/genres", genresRoutes);

    app.use("/roles", rolesRoutes);

    app.use("/media", mediaRoutes);

    app.use("/articles", articleRoutes);

    app.use("/midtrans", midtransRoutes);

    app.get("/", (req, res) => {
      res.json({
        message: "success",
        docs: "",
      });
    });
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "Internal server error" });
    });

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    app.use((req, res) => {
      res.status(404).json({
        message: "routes does not exist",
      });
    });
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

init();
