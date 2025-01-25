const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database");

class OrderItem extends Model {
    static associate(models) {
        this.belongsTo(models.Order, {
            foreignKey: "orderId",
            as: "order",
            onDelete: "CASCADE",
        });
        this.belongsTo(models.Inventory, {
            foreignKey: "inventoryItemId",
            as: "inventoryItem",
        });
    }
}

OrderItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Orders",
                key: "id",
            },
        },
        inventoryItemId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Inventory", // Assuming inventory items table
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        modelName: "OrderItem",
        tableName: "OrderItems",
        timestamps: true,
        underscored: true,
    }
);

module.exports = OrderItem;