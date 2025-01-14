const sequelize = require("./database");

// Import all models here
const { AdminUser } = require("../features/auth/models/admin-user");
const History = require("../features/history/models/history");
const Order = require("../features/order/models/order");
const OrderItem = require("../features/order/models/order-item");
const Client = require("../features/client/models/client")
const Inventory = require("../features/inventory/models/inventory");
const Timer = require("../features/timer/models/timer");

const models
    = { AdminUser, History ,Order, OrderItem,Client,Inventory,Timer};


// Initialize models and associations
Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(sequelize.models);
    }
});

// Export models for use in other parts of the app
module.exports = models;
