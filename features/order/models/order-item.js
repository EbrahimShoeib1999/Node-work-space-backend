const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

const OrderItem = sequelize.define("OrderItem", {
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = OrderItem;
