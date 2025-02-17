'use strict';
const bcrypt = require("bcryptjs");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash("admin123", 10); // Encrypt password

    return queryInterface.bulkInsert("admin_users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000", // Change to a valid UUID if needed
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        balance: 0,
        daily_rate: 100.00, // Optional daily rate
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("admin_users", { username: "admin" }, {});
  },
};
