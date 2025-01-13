const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database");

const PaymentStatuses = {
    PENDING: "PENDING",
    PAID: "PAID",
};

class Reservation extends Model {}

Reservation.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: "Primary key, unique identifier for each reservation",
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Rooms", // Table name
                key: "id",
            },
            field: "room_id",
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Clients", // Table name
                key: "id",
            },
            field: "client_id",
        },
        fromDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "from_date",
        },
        toDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "to_date",
        },
        paymentStatus: {
            type: DataTypes.ENUM(Object.values(PaymentStatuses)),
            allowNull: false,
            defaultValue: PaymentStatuses.PENDING,
            field: "payment_status",
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            field: "total_cost",
        },
    },
    {
        sequelize,
        modelName: "Reservation",
        tableName: "Reservations",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = { Reservation, PaymentStatuses };
