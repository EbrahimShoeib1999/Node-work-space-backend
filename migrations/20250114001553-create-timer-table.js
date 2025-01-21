'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Timers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Use `gen_random_uuid()` for PostgreSQL, adjust for other databases if necessary
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key, unique identifier for each timer',
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Clients', // Ensure this matches the actual table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Hourly rate for the timer',
      },
      timer_status: {
        type: Sequelize.ENUM('ACTIVE', 'PAUSED', 'ENDED'),
        allowNull: false,
        defaultValue: 'PAUSED',
        comment: 'Status of the timer (ACTIVE, PAUSED, ENDED)',
      },
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'PAID'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Payment status for the timer (PENDING, PAID)',
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp for when the timer started',
      },
      pause_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp for when the timer was paused',
      },
      total_active_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total active time of the timer in seconds',
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: 'Total price calculated for the timer',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record last update timestamp',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop ENUM types explicitly before dropping the table
    await queryInterface.dropTable('Timers');
    await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_Timers_timer_status";`
    );
    await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_Timers_payment_status";`
    );
  },
};
