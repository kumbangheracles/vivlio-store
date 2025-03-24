require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Buat database jika belum ada
db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
  if (err) console.error("Error creating database:", err);
  else console.log("Database checked/created");

  // Sambungkan ke database yang dibuat
  db.changeUser({ database: process.env.DB_NAME }, (err) => {
    if (err) console.error("Database selection error:", err);
    else {
      console.log(`Connected to database ${process.env.DB_NAME}`);

      // Buat tabel jika belum ada
      const createTableQuery = `
          CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL
          );
        `;

      db.query(createTableQuery, (err) => {
        if (err) console.error("Error creating table:", err);
        else console.log("Table checked/created");
      });
    }
  });
});

db.connect((err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Database connected");
});

// Get - Read Data
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {});
  //   res.send(`<h1>Hello World</h1>`);
});

app.listen(3000, () => console.log("Server running on port 3000"));
