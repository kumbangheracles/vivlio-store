# 📚 ViviBook — Fullstack Book E-Commerce (EN)

ViviBook is a fullstack book e-commerce application designed to simulate a production-ready system, covering authentication, transaction handling, and admin management.

The system is structured into three main parts:

- **Client (User App)** for end users
- **Server (REST API)** for business logic and data processing
- **Admin (CMS)** for system management

---

## 🚀 Key Features

### 👤 User (Client)

- JWT Authentication (Register & Login)
- Browse book catalog
- Filter by category and genre
- Search books by name
- Wishlist & Cart management
- Checkout with integrated payment gateway
- Order history tracking
- Book rating & review system

### 🛠️ Admin (CMS)

- Book management (CRUD)
- Category & genre management
- Order and transaction management
- User monitoring
- Pagination, search, and filtering

---

## 🔐 Authentication & Authorization

- **JWT Access Token + Refresh Token**
- Secure API route protection
- **Role-Based Access Control (RBAC)**:
  - Super Admin
  - Admin
  - Customer

---

## 💳 Payment Integration

- Integrated with **Midtrans**
- Supports sandbox payment simulation
- Handles transaction states (pending, success, failed)

---

## 🧱 Architecture

```text
Client (User App)  --->  REST API (Server)  --->  Database
        |
        ---> Admin (CMS)
```

- Client and Admin communicate with the backend via API
- Backend handles authentication, authorization, and business logic

---

## 📦 Core Modules

- **Auth Module** — JWT & refresh token
- **User Module** — profile & account management
- **Book Module** — catalog, filter, search
- **Wishlist Module**
- **Cart Module**
- **Order Module** — checkout & transactions
- **Review Module** — rating & reviews
- **Admin Module** — CMS management

---

## 🔍 Highlights

This project demonstrates:

- End-to-end fullstack application development
- Secure implementation of **JWT with refresh tokens**
- Structured **RBAC (Role-Based Access Control)**
- Payment gateway integration
- Complex state management on the frontend
- Scalable and well-structured REST API design
- Real-world e-commerce feature implementation

---

## 🧠 Project Value

ViviBook is more than a basic CRUD application. It represents a real-world e-commerce system that includes:

- Authentication & security
- Transaction handling
- Payment integration
- Multi-role access system
- User experience & data management

# 📚 ViviBook — Fullstack Book E-Commerce (ID)

ViviBook adalah aplikasi e-commerce buku berbasis fullstack yang dirancang untuk mensimulasikan sistem production-ready dengan fitur lengkap, mulai dari autentikasi, transaksi, hingga manajemen admin.

Aplikasi ini terdiri dari:

- **Client (User App)** untuk pengguna
- **Server (REST API)** sebagai pusat business logic
- **Admin (CMS)** untuk manajemen sistem

---

## 🚀 Key Features

### 👤 User (Client)

- JWT Authentication (Login & Register)
- Browse katalog buku
- Filter berdasarkan kategori & genre
- Search buku berdasarkan nama
- Wishlist & Cart management
- Checkout dengan integrasi **Midtrans Payment Gateway**
- Riwayat pesanan
- Rating & Review buku

### 🛠️ Admin (CMS)

- Manajemen buku (CRUD)
- Manajemen kategori & genre
- Manajemen pesanan & status transaksi
- Monitoring pengguna
- Pagination, search, dan filter data

---

## 🔐 Authentication & Authorization

- **JWT Access Token + Refresh Token**
- Secure route protection
- **Role-Based Access Control (RBAC)**:
  - Super Admin
  - Admin
  - Customer

---

## 💳 Payment Integration

- Terintegrasi dengan **Midtrans**
- Mendukung simulasi pembayaran (sandbox)
- Handling status transaksi (pending, success, failed)

---

## 🧱 Architecture

```text
Client (User App)  --->  REST API (Server)  --->  Database
        |
        ---> Admin (CMS)
```

- Frontend dan CMS mengakses backend melalui API
- Backend menangani autentikasi, authorization, dan business logic

---

## 📦 Core Modules

- **Auth Module** — JWT + refresh token
- **User Module** — profil & manajemen akun
- **Book Module** — katalog, filter, search
- **Wishlist Module**
- **Cart Module**
- **Order Module** — checkout & transaksi
- **Review Module** — rating & ulasan
- **Admin Module** — CMS management

---

## 🔍 Highlights

Project ini menunjukkan kemampuan dalam:

- Membangun **fullstack application end-to-end**
- Implementasi **JWT + refresh token** dengan aman
- Desain **RBAC (Role-Based Access Control)**
- Integrasi **payment gateway (Midtrans)**
- Pengelolaan state kompleks di frontend
- Pembuatan REST API yang scalable dan terstruktur
- Pengembangan fitur e-commerce yang lengkap

---

## 🧠 Project Value

ViviBook bukan hanya CRUD application, tetapi simulasi sistem e-commerce nyata yang mencakup:

- Authentication & security
- Transaction handling
- Payment integration
- Multi-role system
- User experience & data management

---
