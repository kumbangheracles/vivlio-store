"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Books", [
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        price: 29.99,
        book_type: "Novel",
        book_subType: "fiction",
        book_cover: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 32.99,
        book_type: "Novel",
        book_subType: "Non-fiction",
        book_cover: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Books", null, {});
  },
};
