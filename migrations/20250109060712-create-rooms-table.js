"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: "Primary key, unique identifier for each room",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Name of the room",
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "How many people the room can accommodate",
      },
      status: {
        type: Sequelize.ENUM("AVAILABLE", "NOT_AVAILABLE"),
        allowNull: false,
        defaultValue: "AVAILABLE",
        comment: "Room availability status",
      },
      hourly_rate: { // Snake case for database naming
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "Hourly rate for the room",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rooms");
  },
};
