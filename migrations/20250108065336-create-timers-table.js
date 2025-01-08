"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Timers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: "Primary key, unique identifier for each timer",
      },
      client_id: { // Snake case for database column
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Clients", // Matches the table name of the Client model
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      hourly_rate: { // Snake case
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      timer_status: { // Snake case
        type: Sequelize.ENUM("ACTIVE", "PAUSED", "ENDED"),
        allowNull: false,
        defaultValue: "PAUSED",
      },
      payment_status: { // Snake case
        type: Sequelize.ENUM("PENDING", "PAID"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      start_time: { // Snake case
        type: Sequelize.DATE,
        allowNull: true,
      },
      pause_time: { // Snake case
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_active_time: { // Snake case
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_price: { // Snake case
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      created_at: { // Snake case
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: { // Snake case
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Timers");
  },
};
