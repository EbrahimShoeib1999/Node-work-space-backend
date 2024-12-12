const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");
const Client = require("../../client/models/client");

const Timer = sequelize.define("Timer", {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  timestamps: true,
});
Timer.belongsTo(Client, { foreignKey: "clientId" });

module.exports = Timer;
