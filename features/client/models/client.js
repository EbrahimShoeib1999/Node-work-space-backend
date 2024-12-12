const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

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

module.exports = Client;
