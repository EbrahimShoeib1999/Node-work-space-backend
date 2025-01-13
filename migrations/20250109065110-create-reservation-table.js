"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: "Primary key, unique identifier for each reservation",
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Rooms", // Matches the table name for Rooms
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Clients", // Matches the table name for Clients
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      from_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      to_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM("PENDING", "PAID"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      total_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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
    await queryInterface.dropTable("Reservations");
  },
};
