"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      `SELECT categoryId FROM book_category LIMIT 1;`
    );

    // const categoryId = categories[0][0]?.categoryId;

    // if (!categoryId) {
    //   throw new Error(
    //     "No category found in book_category. Please seed category first."
    //   );
    // }
    // return queryInterface.bulkInsert("Books", [
    //   {
    //     title: "The Pragmatic Programmer",
    //     author: "Andrew Hunt",
    //     price: 29.99,
    //     book_type: "Novel",
    //     categoryId: categoryId,
    //     book_cover: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     title: "Clean Code",
    //     author: "Robert C. Martin",
    //     price: 32.99,
    //     book_type: "Novel",
    //     categoryId: categoryId,
    //     book_cover: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Books", null, {});
  },
};
