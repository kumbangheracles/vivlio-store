# 📚 BACK-END VIVLIO-STORE

This project is using Express.js, Sequelize, and MySQL to manage book data.

## 🚀 Features

- CRUD (Create, Read, Update, Delete) operations for books.
- Uses Sequelize as ORM.
- Uses `.env` for flexible database configuration across different environments.

---

## 🛠 Installation

### 1️⃣ **Clone the Repository**

```sh
git clone <repository_url>
cd book-store-api
```

### 2️⃣ **Install Dependencies**

```sh
npm install
```

### 3️⃣ **Create a `.env` File**

Create a `.env` file in the project root and add the following database configuration:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=book_store
DB_PORT=3306
```

> **Ensure** MySQL is running and the `book_store` database is created!

### 4️⃣ **Run Migrations & Seeders (Optional)**

If you want to populate the database with sample data:

```sh
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 5️⃣ **Start the Server**

```sh
npm start
```

The server will run at `http://localhost:3000`

---

## 📌 API Endpoints (On progress)

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| GET    | `/books` | Retrieve all books |

---

## 📂 Project Structure

```
📂 back-end
 ┣ 📂 models       # Sequelize models
 ┃ ┣ 📜 book.js    # Book model
 ┃ ┣ 📜 index.js   # Sequelize initialization
 ┣ 📂 seeders      # Database seeders
 ┣ 📜 .env.example # Example environment configuration
 ┣ 📜 .gitignore   # Ignore unnecessary files
 ┣ 📜 app.js       # Main server file
 ┣ 📜 package.json # Dependencies
```

---

## 💡 Contribution

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push the branch (`git push origin feature-branch`).
5. Open a pull request.

## SEQUELIZE

# 📘 Sequelize Guide

This document provides an overview of Sequelize, how it is used in this project, and step-by-step instructions to manage the database using Sequelize.

---

## 🔹 What is Sequelize?

Sequelize is a promise-based Node.js ORM (Object-Relational Mapping) for MySQL, PostgreSQL, SQLite, and MSSQL. It simplifies database interactions by allowing developers to work with JavaScript objects instead of raw SQL queries.

---

## 📌 How Sequelize is Used in This Project

- **Database Connection:** Sequelize handles the connection to MySQL defined in the `.env` file instead of `config/config.json`.
- **Models:** Data structure definitions are stored in the `models/` directory.
- **Migrations & Seeders:** The `migrations/` directory contains database schema changes, and `seeders/` populate initial data.

---

## ❗ Note on `config/config.json`

In this project, we do **not** use `config/config.json` for database configuration. Instead, we use environment variables (`.env`) for better flexibility and security. Ensure you have a `.env` file with the necessary database configurations.

Example `.env` file:

```
DB_HOST= . . .
DB_USER= . . .
DB_PASSWORD= . . .
DB_NAME= . . .
DB_PORT= . . .
```

This setup allows each developer to use their own local database configuration without modifying project files.

---

## 🛠 Setting Up Sequelize

### 1️⃣ Install Sequelize and Dependencies

```sh
npm install sequelize sequelize-cli mysql2
```

### 2️⃣ Initialize Sequelize

Run the following command to set up Sequelize in the project:

```sh
npx sequelize-cli init
```

This will create the following structure:

```
📂 config       # Database configuration
📂 models       # Sequelize models
📂 migrations   # Database migration files
📂 seeders      # Data seeding files
```

### 3️⃣ Configure Database

Edit `config/config.json` to define your database connection:

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "book_store",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

> **However, this file is not used in this project. Use `.env` instead.**

### 4️⃣ Create a Model

Example: Creating a `Book` model:

```sh
npx sequelize-cli model:generate --name Book --attributes title:string,author:string,price:decimal
```

# Create a migration

```sh
npx sequelize-cli migration:generate --name create-users
```

This generates:

- A model file in `models/book.js`
- A migration file in `migrations/`

### 5️⃣ Run Migrations

To apply migrations and create tables in the database:

```sh
npx sequelize-cli db:migrate
```

### 6️⃣ Create a Seeder

To insert initial data into the database:

```sh
npx sequelize-cli seed:generate --name demo-books
```

Then edit the generated file in `seeders/` to add data.
Run the seeder with:

```sh
npx sequelize-cli db:seed:all
```

---

## Generate Migration And Seeder

npx sequelize-cli migration:generate --name migrate-name
npx sequelize-cli seed:generate --name seed-name

## Check Migration And Seeder

npx sequelize-cli db:migrate:status
npx sequelize-cli db:seed:status

## 🔄 Running Sequelize Commands

| Command                                 | Description             |
| --------------------------------------- | ----------------------- |
| `npx sequelize-cli db:migrate`          | Apply migrations        |
| `npx sequelize-cli db:migrate:undo:all` | Rollback last migration |
| `npx sequelize-cli db:seed:all`         | Run all seeders         |
| `npx sequelize-cli db:seed:undo:all`    | Undo all seeders        |

---

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all

## if anything isn't controllable use this

npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate

## ✅ Best Practices

- Keep models and migrations updated.
- Use environment variables instead of hardcoded database credentials.
- Regularly backup your database before running migrations.

This guide provides a structured way to use Sequelize in the Vivlio Store API project efficiently. 🚀

# Flow jwt cookie 2 secret keys

+------------+ +-------------+ +-----------------+
| Register | ---> | Verify Email| ---> | Login |
+------------+ +-------------+ +-----------------+

                                                      |
                                                      | Access Token (in memory)
                                                      | Refresh Token (cookie)
                                                      v


                                                +------------+
                                                |  Access API|
                                                +------------+

                                                    |
                                                    |-- If accessToken expired -->
                                                    |
                                              +-----------------+
                                              | Refresh (/refresh)
                                              +-----------------+
                                                      |
                                                      v
                                                New accessToken

# Pagination

### Visualisasi Lengkap

Total Data: 100 buku
Limit: 10 buku per halaman

### Page 1

page = 1
limit = 10
offset = (1 - 1) × 10 = 0

### Page 2

page = 2
limit = 10
offset = (2 - 1) × 10 = 10

### Page 3

page = 3
limit = 10
offset = (3 - 1) × 10 = 20

// SQL: SELECT \* FROM books LIMIT 10 OFFSET 20
// Artinya: Skip 20 data pertama, lalu ambil 10 data berikutnya
// Hasil: Buku 21-30

| Index | Buku                   |
| ----- | ---------------------- |
| 0-19  | Buku 1-20 ❌ (di-skip) |
| 20    | Buku 21 ✅             |
| 21    | Buku 22 ✅             |
| ...   | ... ✅                 |
| 29    | Buku 30 ✅             |

┌─────────────────────────────────────────────┐
│ Page 1: offset=0 → Ambil buku 1-10 │
│ [1][2][3][4][5][6][7][8][9][10] │
├─────────────────────────────────────────────┤
│ Page 2: offset=10 → Skip 10, ambil 11-20 │
│ [11][12][13][14][15][16][17][18][19][20] │
├─────────────────────────────────────────────┤
│ Page 3: offset=20 → Skip 20, ambil 21-30 │
│ [21][22][23][24][25][26][27][28][29][30] │
├─────────────────────────────────────────────┤
│ ... dan seterusnya hingga halaman 10 │
└─────────────────────────────────────────────┘

```

```

## DOCKERIZE

<!-- Build first then run -->

<!-- Build -->

docker build -t reactjs/cms-vivibook:1.0.0 .

<!-- Build in specific dockerfile -->

<!-- example for stg -->

docker build -t reactjs-stg/cms-vivibook:1.0.0 -f Dockerfile.stg .

<!-- Run -->

<!-- dev -->

docker run -d -p 3001:3001 reactjs/cms-vivibook:1.0.0

<!-- stg -->

docker run -d -p 3001:3001 reactjs-stg/cms-vivibook:1.0.0

<!-- Run all container -->

docker-compose up -d --build

<!-- Cara  Masuk langsung ke MySQL container -->

docker exec -it mysql_db mysql -u root -p

<!-- delete container and run again -->

docker-compose down -v
docker-compose up -d --build

<!-- backup data -->

mysqldump -u root -p vivlio_store > backup.sql

docker cp backup.sql mysql_db:/backup.sql

docker exec -i mysql_db mysql -u root -p vivlio_store < backup.sql

<!-- ID -->
<!-- Ada beberapa kendala saat conteinerisasi setelah db di containerkan nama-nama tabelnya gk konsisten jadi harus rename manual tabel-tabel yg namanya tidak konsisten -->
<!-- EN -->
<!-- There are several obstacles during containerization. After the DB is containerized, the table names are inconsistent, so you have to manually rename the tables with inconsistent names. -->

# ViviBook

<!-- delete container and run again -->

docker-compose down -v
docker-compose up -d --build

## Flow

Alur Setup Container

1. Pastikan kode sudah beres

2. Export data dari MySQL lokal
   export PATH=$PATH:"/c/Program Files/MySQL/MySQL Server 8.0/bin"
   mysqldump -u root -p vivlio_store > backup.sql
3. Build & jalankan container dari scratch

   docker-compose down -v # hapus container + volume lama
   docker-compose up -d --build # build ulang

4. Tunggu container ready, lalu import data
   Tunggu beberapa detik sampai MySQL container healthy
   docker exec -i mysql_db mysql -u root -p"db_password" vivlio_store < backup.sql
5. Restart app (supaya koneksi DB fresh)

   docker-compose restart backend

6. Verifikasi
   docker exec -it mysql*db mysql -u root -p"db_password" vivlio_store -e "SHOW TABLES; SELECT COUNT(*) FROM Users; SELECT COUNT(\_) FROM Books;"

# Jika masih gagal

# Drop dan recreate database

docker exec -it mysql_db mysql -u root -p"db_password" -e "DROP DATABASE vivlio_store; CREATE DATABASE vivlio_store;"

# Import backup

docker exec -i mysql_db mysql -u root -p"db_password" vivlio_store < backup.sql

# Restart backend supaya koneksi fresh

docker-compose restart backend
