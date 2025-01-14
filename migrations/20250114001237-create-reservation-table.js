'use strict';

const { PaymentStatuses } = require('../features/reservations/models/reservation');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key, unique identifier for each reservation',
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rooms', // Referencing the Rooms table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Clients', // Referencing the Clients table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        type: Sequelize.ENUM(...Object.values(PaymentStatuses)),
        allowNull: false,
        defaultValue: PaymentStatuses.PENDING,
      },
      total_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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

  down: async (queryInterface, Sequelize) => {
    // Drop the ENUM type explicitly before dropping the table
    await queryInterface.dropTable('Reservations');
    await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_Reservations_payment_status";`
    );
  },
};
