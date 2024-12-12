const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");
const Client = require("../../client/models/client");

const Status = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELED: "CANCELED",
};

const Order = sequelize.define("Order", {
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(Object.values(Status)),
    allowNull: false,
    defaultValue: Status.PENDING,
  },
}, {
  timestamps: true,
});

Order.belongsTo(Client, { foreignKey: "clientId" });

module.exports = { Order, Status };
