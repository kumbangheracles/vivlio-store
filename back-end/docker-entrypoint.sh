#!/bin/sh
echo "Running migrations..."
npx sequelize-cli db:migrate

# echo "Running seeders..."
# npx sequelize-cli db:seed:all

# echo "Renaming tables..."
# node -e "
# const { sequelize } = require('./config/database');
# (async () => {
#   try {
#     await sequelize.query('RENAME TABLE IF EXISTS book_category TO BookCategory');
#     await sequelize.query('RENAME TABLE IF EXISTS book_genres TO BookGenres');
#     await sequelize.query('RENAME TABLE IF EXISTS sequelizemeta TO Sequelizemeta');
#     await sequelize.query('RENAME TABLE IF EXISTS roles TO Roles');
#     await sequelize.query('RENAME TABLE IF EXISTS articleimages TO ArticleImages');
#     await sequelize.query('RENAME TABLE IF EXISTS articles TO Articles');
#     await sequelize.query('RENAME TABLE IF EXISTS books TO Books');
#     await sequelize.query('RENAME TABLE IF EXISTS bookimages TO BookImages');
#     await sequelize.query('RENAME TABLE IF EXISTS bookstats TO BookStats');
#     await sequelize.query('RENAME TABLE IF EXISTS usercart TO UserCart');
#     await sequelize.query('RENAME TABLE IF EXISTS bookreviews TO BookReviews');
#     await sequelize.query('RENAME TABLE IF EXISTS userpurchases TO UserPurchases');
#     await sequelize.query('RENAME TABLE IF EXISTS userimages TO UserImages');
#     await sequelize.query('RENAME TABLE IF EXISTS userwishlist TO UserWishlist');
#     await sequelize.query('RENAME TABLE IF EXISTS users TO Users');
#     console.log('Tables renamed successfully');
#   } catch (e) {
#     console.log('Rename skipped:', e.message);
#   } finally {
#     await sequelize.close();
#   }
# })();
# "

echo "Starting server..."
npm run dev