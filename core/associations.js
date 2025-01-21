const sequelize = require("./database");

// Import all models here
const { AdminUser } = require("../features/auth/models/admin-user");
const History = require("../features/history/models/history");
const Order = require("../features/order/models/order");
const OrderItem = require("../features/order/models/order-item");
const Client = require("../features/client/models/client")
const Inventory = require("../features/inventory/models/inventory");
const {Timer} = require("../features/timer/models/timer");
const {Reservation} = require("../features/reservations/models/reservation");
const Room = require("../features/rooms/models/room");

const models
    = { AdminUser,Room,History ,Order, OrderItem,Reservation,Client,Inventory,Timer,};


// Initialize models and associations
Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(sequelize.models);
    }
});

// sequelize.sync({ force: true ,alter : true})
//
//     .then(() => {
//         console.log("Database synced successfully!");
//     })
//     .catch((err) => {
//         console.error("Error syncing database:", err);
//     });

// Export models for use in other parts of the app
module.exports = models;
