const { DataTypes, Model} = require("sequelize");
const sequelize = require("../../../core/database");
const Client = require("../../client/models/client");

const TimerStatuses = {
    ACTIVE: "ACTIVE",
    PAUSED: "PAUSED",
    ENDED: "ENDED",
};

const PaymentStatuses = {
    PENDING: "PENDING",
    PAID: "PAID",
};

class Timer extends Model {
    // Static method for defining associations
    static associate(models) {
        Timer.belongsTo(models.Client, { foreignKey: "clientId" });
    }
}

Timer.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key, unique identifier for each admin user',
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Clients", // Name of the table, not the model
                key: "id",
            },
        },
        hourlyRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        timerStatus: {
            type: DataTypes.ENUM(Object.values(TimerStatuses)),
            allowNull: false,
            defaultValue: TimerStatuses.PAUSED,
        },
        paymentStatus: {
            type: DataTypes.ENUM(Object.values(PaymentStatuses)),
            allowNull: false,
            defaultValue: PaymentStatuses.PENDING,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        pauseTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        totalActiveTime: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
    },
    {
        sequelize,
        modelName: "Timer",
        tableName: "Timers", // Explicit table name
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

module.exports = { Timer, TimerStatuses, PaymentStatuses };

