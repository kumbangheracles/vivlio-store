"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("books", [
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        price: 29.99,
        book_type: "Novel",
        book_subType: "fiction",
        imageUrl: "../image/the_pragmatic_programmer.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 32.99,
        book_type: "Novel",
        book_subType: "Non-fiction",
        imageUrl: "../image/clean_code.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("books", null, {});
  },
};
