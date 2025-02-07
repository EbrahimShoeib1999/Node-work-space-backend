'use strict';
const { DataTypes } = require("sequelize");
const { Roles } = require('../features/auth/models/admin-user'); // Updated Roles Enum

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "CASHIER", "EMPLOYEE", "MANAGER","CHIEF"), // Updated ENUM
        allowNull: false,
        defaultValue: "EMPLOYEE", // Default role
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0, // Initial balance
      },
      daily_rate: {
        type: Sequelize.FLOAT,
        allowNull: true, // Can be null if not set
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table and clean up ENUM
    await queryInterface.dropTable('AdminUsers');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_AdminUsers_role";'); // Drop ENUM type
  },
};
