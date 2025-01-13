const { DataTypes } = require("sequelize");
const sequelize = require('../../../core/database');

const OrderItem = sequelize.define(
      'OrderItem',
      {
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Orders', // Name of the referenced table
            key: 'id', // Name of the referenced column
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        inventoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'inventory', // Name of the referenced table
            key: 'id', // Name of the referenced column
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1, // Ensure quantity is at least 1
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0, // Ensure price is not negative
          },
        },
      },
      {
        timestamps: true, // Adds createdAt and updatedAt fields
        underscored: true, // Converts camelCase to snake_case in the database
      }
    );
  
    module.exports = {OrderItem}