'use strict';
const { DataTypes } = require("sequelize");
const sequelize = require('../../core/database')
const Product = sequelize.define(
    
  "Product",
  {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      underscored: true, // Use snake_case in the database
    }
  );
  module.exports = {Product};
