// models/associations.js
const order = require("./order");
const orderItem = require("./order-item");

// Define the associations
order.hasMany(orderItem, {
  foreignKey: "order_id",
  as: "orderItem",
});

orderItem.belongsTo(order, {
  foreignKey: "order_id",
  as: "order",
});

module.exports = { order, orderItem };