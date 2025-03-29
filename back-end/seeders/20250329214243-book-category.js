"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("book_category", [
      {
        name: "Fiction",
        description:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid odio distinctio sint nesciunt alias veritatis eos reprehenderit! Libero ipsa eius quidem? Cum, architecto adipisci. Nulla minus consequuntur dolorum perspiciatis animi",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("book_category", null, {});
  },
};
