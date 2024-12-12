const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

const Inventory = sequelize.define("Inventory", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitType: {
    type: DataTypes.ENUM,
    values: ["piece", "gram"],
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Inventory;
