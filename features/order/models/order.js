const { DataTypes } = require("sequelize");
const sequelize = require('../../../core/database');

const Status = ["pending", "paid", "canceled"]
const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "client_id", // Maps to "client_id" in the database
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "canceled"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at", // Maps to "created_at" in the database
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at", // Maps to "updated_at" in the database
    },
  },
  {
    tableName: "orders", // Explicitly set the table name
    timestamps: true, // Enable Sequelize's automatic timestamps
  }
);

module.exports = {Order, Status};