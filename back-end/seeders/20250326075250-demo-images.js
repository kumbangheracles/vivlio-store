"use strict";
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    // return queryInterface.bulkInsert("Images", [
    //   {
    //     filename: "clean_code.jpeg",
    //     bookId: uuidv4(),
    //     url: "http://localhost:3000/books/uploads/clean_code.jpeg",
    //     type: "cover",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     filename: "the_pragmatic_programmer.jpg",
    //     bookId: uuidv4(),
    //     url: "http://localhost:3000/books/uploads/the_pragmatic_programmer.jpg",
    //     type: "cover",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Images", null, {});
  },
};
