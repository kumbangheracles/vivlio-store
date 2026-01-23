require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const BookCategoryRoutes = require("./routes/book_category");
const BookReviewsRoutes = require("./routes/book_review");
const genresRoutes = require("./routes/genre");
const rolesRoutes = require("./routes/role");
const authRoutes = require("./routes/auth");
const userWishlistRoutes = require("./routes/userWishlist");
const userCartRoutes = require("./routes/cart");
const midtransRoutes = require("./routes/midtrans");
const mediaRoutes = require("./routes/media");
const articleRoutes = require("./routes/article");

const { swaggerUi, specs } = require("./docs/swagger");

const app = express();

/* ================= MIDDLEWARE ================= */

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

/* ================= ROUTES ================= */

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/book-reviews", BookReviewsRoutes);
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({
    message: "routes does not exist",
  });
});

module.exports = app;
