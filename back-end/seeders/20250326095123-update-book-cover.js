"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE Books
      SET book_cover = (
        SELECT url FROM Images 
        WHERE Images.bookId = Books.id 
        AND Images.type = 'cover'
      )
      WHERE EXISTS (
        SELECT 1 FROM Images 
        WHERE Images.bookId = Books.id 
        AND Images.type = 'cover'
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE Books
      SET book_cover = ''
    `);
  },
};
