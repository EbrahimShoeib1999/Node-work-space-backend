const Order = require("../models/order");
const OrderItem = require("../models/order-item");

// Define relationships
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "orderItems", // Alias for accessing order items
  onDelete: "CASCADE", // Delete order items when an order is deleted
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order", // Alias for accessing the parent order
});

module.exports = {
  Order,
  OrderItem,
};