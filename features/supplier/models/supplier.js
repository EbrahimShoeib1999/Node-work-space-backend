const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database');

class Supplier extends Model {}

Supplier.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Primary key, unique identifier for each supplier',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the supplier',
        },
        responsibleName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'responsible_name',
            comment: 'Name of the responsible person for the supplier (optional)',
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Contact phone number of the supplier',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
            comment: 'Email address of the supplier (optional)',
        },
        niche: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'The niche or industry category of the supplier',
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Address of the supplier',
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Balance associated with the supplier, starts at 0',
        },
    },
    {
        sequelize,
        modelName: 'Supplier',
        tableName: 'suppliers',
        timestamps: true,
        underscored: true,
        comment: 'Manages supplier details such as contact information, niche, and balance',
    }
);

module.exports = Supplier;
