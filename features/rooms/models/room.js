const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database");

class Room extends Model {
    static associate(models) {
        Room.hasMany(models.Reservation, { foreignKey: "roomId" });
    }
}

Room.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: "Primary key, unique identifier for each room",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Name of the room",
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "How many people the room can accommodate",
        },
        status: {
            type: DataTypes.ENUM("AVAILABLE", "NOT_AVAILABLE"),
            allowNull: false,
            defaultValue: "AVAILABLE",
            comment: "Room availability status",
        },
        hourlyRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            comment: "Hourly rate for the room",
        },
    },
    {
        sequelize,
        modelName: "Room",
        tableName: "Rooms",
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Room;
