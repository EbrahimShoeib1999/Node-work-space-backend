const { Sequelize } = require("sequelize");
const sequelize = require("../core/database");
const { Timer } = require("../features/timer/models/timer");
const Client = require("../features/client/models/client");

const models = {
  Timer: Timer.init(sequelize),
  Client: Client.init(sequelize),
};

// Define associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
