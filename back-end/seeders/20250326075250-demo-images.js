"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
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
        type: "gallery",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Images", null, {});
  },
};
