// models/Room.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database');
const Reservation = require('../models/Reservation');

class Room extends Model {
    static associate(models) {
        // Room has many Reservations
        Room.hasMany(models.Reservation, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    }
}

Room.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Room',
        timestamps: true,
    }
);

module.exports = Room;
