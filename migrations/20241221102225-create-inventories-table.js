'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Name of the inventory item',
      },
      supplier_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key referencing the supplier of the inventory item',
      },
      unit_type: {
        type: DataTypes.ENUM("piece", "gram", "kilogram", "litre"),
        allowNull: false,
        comment: 'Type of unit for the inventory item (e.g., piece, gram, kilogram, litre)',
      },
      stock_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Available quantity of the inventory item in stock',
      },
      buying_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price at which the inventory item was purchased',
      },
      selling_price_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Selling price per unit of the inventory item',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record last update timestamp',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the ENUM type before dropping the table
    await queryInterface.dropTable('inventory');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_inventory_unit_type";');
  },
};
