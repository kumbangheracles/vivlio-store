# 📚 Book Store API

Book Store API is a backend project using Express.js, Sequelize, and MySQL to manage book data.

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

## 📌 API Endpoints
| Method | Endpoint       | Description            |
|--------|--------------|----------------------|
| GET    | `/books`      | Retrieve all books  |
| POST   | `/books`      | Add a new book      |
| PUT    | `/books/:id`  | Update book details |
| DELETE | `/books/:id`  | Delete a book       |

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
