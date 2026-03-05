"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET address = '{}'
      WHERE address IS NULL OR address = '';
    `);

    await queryInterface.changeColumn("users", "address", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "address", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
