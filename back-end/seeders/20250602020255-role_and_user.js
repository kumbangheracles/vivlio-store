"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminRoleId = uuidv4();
    const customerRoleId = uuidv4();

    await queryInterface.bulkInsert("Roles", [
      {
        id: adminRoleId,
        name: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: customerRoleId,
        name: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Users", [
      {
        username: "herkaladmin",
        email: "herkal@admin.com",
        password: await bcrypt.hash("admin123", 10),
        role_id: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "herkalcustomer",
        email: "herkal@customer.com",
        password: await bcrypt.hash("customer123", 10),
        role_id: customerRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "herkal",
        email: "herkal@gmail.com",
        password: await bcrypt.hash("herkal123", 10),
        role_id: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {
      email: ["admin@example.com", "customer@example.com", "herkal@gmail.com"],
    });
    await queryInterface.bulkDelete("Roles", {
      name: ["admin", "customer"],
    });
  },
};
