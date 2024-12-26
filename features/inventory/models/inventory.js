const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database');

class Inventory extends Model {}

Inventory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key, unique identifier for each inventory item',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the inventory item',
        },
        supplierId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'supplier_id',
            comment: 'Foreign key referencing the supplier of the inventory item',
        },
        unitType: {
            type: DataTypes.ENUM("piece", "gram", "kilogram", "litre"),
            allowNull: false,
            field: 'unit_type',
            comment: 'Type of unit for the inventory item (e.g., piece, gram)',
        },
        stockQuantity: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'stock_quantity',
            comment: 'Available quantity of the inventory item in stock',
        },
        unitBuyingPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'unit_buying_price',
            comment: 'Calculated unit buying price based on stock and total buying price',
        },
        totalBuyingPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_buying_price',
            comment: 'Total cost of the current stock',
        },
        sellingPricePerUnit: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'selling_price_per_unit',
            comment: 'Selling price per unit of the inventory item',
        },
    },
    {
        sequelize,
        modelName: 'Inventory',
        tableName: 'inventory',
        timestamps: true,
        underscored: true,
        comment: 'Manages inventory items, their suppliers, and pricing details',
    }
);

module.exports = Inventory;
