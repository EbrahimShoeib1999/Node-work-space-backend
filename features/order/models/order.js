const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database");

class Order extends Model {
    static associate(models) {
        this.hasMany(models.OrderItem, {
            foreignKey: "orderId",
            as: "orderItems",
            onDelete: "CASCADE",
        });
        this.belongsTo(models.Client, {
            foreignKey: "clientId",
            as: "client",
        });
    }
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Clients", // Assuming the client table name
                key: "id",
            },
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
            comment: 'Total price of the order calculated based on order items',
        },
        paymentStatus: {
            type: DataTypes.ENUM("PENDING", "PAID"),
            defaultValue: "PENDING",
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "Order",
        tableName: "Orders",
        timestamps: true,
        underscored: true,
    }
);

module.exports = Order;