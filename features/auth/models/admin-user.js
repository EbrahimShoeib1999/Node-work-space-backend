const { DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

// Enum definitions
const Roles = {
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  USER: "USER",
};

const AdminUser = sequelize.define("AdminUser", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures the email is in a valid format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: Object.values(Roles), // Use enum values
    allowNull: false,
    defaultValue: Roles.USER, // Default role if not specified
  },

});

module.exports = { AdminUser, Roles };
