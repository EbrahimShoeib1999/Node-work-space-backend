'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderItems', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      inventory_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'inventory', // Assuming you have an Inventory model
          key: 'id',
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      status: {
        type: Sequelize.ENUM('preparing', 'ready'), // Adding the status field
        allowNull: false,
        defaultValue: 'preparing', // Default value is 'preparing'
        comment: "Indicates whether the item is preparing or ready to serve",
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
    // Drop the status field first before dropping the table
    await queryInterface.removeColumn('OrderItems', 'status');

    await queryInterface.dropTable('OrderItems');
  },
};
