'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('suppliers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key, unique identifier for each supplier',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the supplier',
      },
      responsible_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Name of the responsible person for the supplier (optional)',
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Contact phone number of the supplier',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
        comment: 'Email address of the supplier (optional)',
      },
      niche: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The niche or industry category of the supplier',
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Address of the supplier',
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Balance associated with the supplier, starts at 0',
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
    await queryInterface.dropTable('suppliers');
  },
};
