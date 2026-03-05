# ViviBook

<!-- delete container and run again -->

docker-compose down -v
docker-compose up -d --build

## Flow

Alur Setup Container

1. Pastikan kode sudah beres

sequelize.sync() sudah dihapus dari server.js
Semua migration sudah lengkap

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
