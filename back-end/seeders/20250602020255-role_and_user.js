"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminRoleId = uuidv4();
    const customerRoleId = uuidv4();
    const superAdminRoleId = uuidv4();

    await queryInterface.bulkInsert("Roles", [
      {
        id: superAdminRoleId,
        name: "super_admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
        id: uuidv4(),
        username: "herkalsuperadmin",
        fullName: "Ahmad Herkal Taqyudin",
        email: "herkalsuper@admin.com",
        password: await bcrypt.hash("superadmin123", 10),
        roleId: superAdminRoleId,
        isVerified: true,
        isActive: true,
        verificationCode: null,
        verificationCodeCreatedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "herkaladmin",
        fullName: "Ahmad Herkal Taqyudin",
        email: "herkal@admin.com",
        password: await bcrypt.hash("admin123", 10),
        roleId: adminRoleId,
        isVerified: true,
        isActive: true,
        verificationCode: null,
        verificationCodeCreatedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "herkalcustomer",
        fullName: "Ahmad Herkal Taqyudin",
        email: "herkal@customer.com",
        password: await bcrypt.hash("customer123", 10),
        roleId: customerRoleId,
        isVerified: false,
        isActive: false,
        verificationCode: "123456",
        verificationCodeCreatedAt: new Date(),
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
