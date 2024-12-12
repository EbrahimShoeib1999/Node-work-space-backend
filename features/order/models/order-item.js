const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");
const {Order} = require("./order");
const Inventory = require("../../inventory/models/inventory");

const OrderItem = sequelize.define("OrderItem", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inventoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true,
});

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Inventory, { foreignKey: "inventoryId" });

module.exports = OrderItem;
