const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

const Order = sequelize.define("Order", {
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Order;
