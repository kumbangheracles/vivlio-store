"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Images", [
      {
        filename: "clean_code.jpeg",
        bookId: 1,
        url: "http://localhost:3000/books/uploads/clean_code.jpeg",
        type: "cover",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        filename: "the_pragmatic_programmer.jpg",
        bookId: 2,
        url: "http://localhost:3000/books/uploads/the_pragmatic_programmer.jpg",
        type: "cover",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Images", null, {});
  },
};
