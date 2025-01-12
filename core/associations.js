const sequelize = require("./database");

// Import all models here
const { AdminUser, Roles } = require("../features/auth/models/admin-user");
const History = require("../features/history/models/history");

const models = { AdminUser, Roles, History };

// Initialize models and associations
Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
        model.associate(sequelize.models);
    }
});

// Export models for use in other parts of the app
module.exports = models;
