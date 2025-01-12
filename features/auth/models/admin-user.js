const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database');


class AdminUser extends Model {
    static associate(models) {
        AdminUser.hasMany(models.History, { foreignKey: "userId" });
    }
}

const Roles = {
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  EMPLOYEE: "EMPLOYEE",
  MANAGER: "MANAGER",
};

AdminUser.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key, unique identifier for each admin user',
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique username for the admin user',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: 'Email address of the admin user',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Encrypted password of the admin user',
      },
      role: {
        type: DataTypes.ENUM(Object.values(Roles)), // Use the Roles enum values
        allowNull: false,
        defaultValue: Roles.EMPLOYEE,
        comment: 'Role of the user in the system',
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Balance associated with the admin user, starts at 0',
      },
      dailyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'daily_rate',  // Maps to the 'daily_rate' column in the DB
        comment: 'Optional daily rate for the admin user, used for automated calculations',
      },
    },
    {
      sequelize,
      modelName: 'AdminUser',
      tableName: 'admin_users',
      timestamps: true,
      underscored: true,
      comment: 'Manages system admin users, their roles, and financial details',
    }
);

module.exports = {AdminUser,Roles};
