const { AdminUser, Roles } = require("../features/auth/models/admin-user");
const Client = require("../features/client/models/client");
const Timer = require("../features/timer/models/timer");
const Inventory = require("../features/inventory/models/inventory");
const Order = require("../features/order/models/order");
const OrderItem = require("../features/order/models/order-item");

// Define relationships
Client.hasMany(Timer, { foreignKey: "clientId" });
Timer.belongsTo(Client, { foreignKey: "clientId" });

Client.hasMany(Order, { foreignKey: "clientId" });
Order.belongsTo(Client, { foreignKey: "clientId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Inventory.hasMany(OrderItem, { foreignKey: "inventoryId" });
OrderItem.belongsTo(Inventory, { foreignKey: "inventoryId" });

module.exports = {
  AdminUser,
  Roles,
  Client,
  Timer,
  Inventory,
  Order,
  OrderItem,
};
