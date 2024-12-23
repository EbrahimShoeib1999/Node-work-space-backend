const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");
const {Order} = require("../../order/models/order");
const {Timer} = require("../../timer/models/timer");

const Client = sequelize.define("Client", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactInfo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});


Client.associate = (models) => {
  Client.hasMany(models.Order, { foreignKey: "clientId" });
  Client.hasMany(models.Timer, { foreignKey: "clientId" });
};

module.exports = Client;
