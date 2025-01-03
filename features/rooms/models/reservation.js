// models/Reservation.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database');

class Reservation extends Model {
    static associate(models) {
        // Reservation belongs to Room
        Reservation.belongsTo(models.Room, { foreignKey: 'roomId' });
        // Reservation belongs to Client
        Reservation.belongsTo(models.Client, { foreignKey: 'clientId' });
    }
}

Reservation.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Rooms', // Table name as per Sequelize conventions
                key: 'id',
            },
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Clients', // Table name for the Client model
                key: 'id',
            },
        },

        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Reservation',
        timestamps: true,
    }
);

module.exports = Reservation;
