const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database");
const { AdminUser, Roles } = require('../../auth/models/admin-user');

class History extends Model {
    static associate(models) {
        History.belongsTo(models.AdminUser, { foreignKey: "userId" });
    }
}

History.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: "Primary key, unique identifier for each transaction",
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "admin_users", // Ensure the table name is correct
                key: "id",
            },
            field: "user_id",
        },
        action: {
            type: DataTypes.ENUM(
                "USER_LOGIN",

                "ORDERED",
                "ORDER_PAID",
                "ORDER_DELETED",

                "SESSION_STARTED",
                "SESSION_ENDED",
                "SESSION_PAID",
                "SESSION_DELETED",

                "RESERVATION",
                "RESERVATION_PAID",
                "RESERVATION_DELETED",
            ),
            allowNull: false,
            comment: "The type of action performed",
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Additional details about the transaction, if any",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "updated_at",
        },
    },
    {
        sequelize,
        modelName: "History",
        tableName: "Histories",
        timestamps: true,
        underscored: true,
    }
);

module.exports = History;
