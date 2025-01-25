const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../core/database");

class Client extends Model {
  // Static method for defining associations
  static associate(models) {
    Client.hasMany(models.Order, { foreignKey: "clientId"});
    Client.hasMany(models.Timer, { foreignKey: "clientId" })
    Client.hasMany(models.Reservation, { foreignKey: "clientId" });
  }
}

Client.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key, unique identifier for each admin user',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactInfo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Client",
      tableName: "Clients", // Explicit table name
      timestamps: true, // Adds createdAt and updatedAt fields
    }
);

module.exports = Client;
