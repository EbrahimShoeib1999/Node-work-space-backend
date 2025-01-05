const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../core/database')
class Treasury extends Model {}

Treasury.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        transactionType: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
            comment: 'Type of transaction: income or expense',
        },
        specificType: {
            type: DataTypes.ENUM(
                'sales',
                'suppliers payment',
                'salary payment',
                'rent',
                'utilities',
                'maintenance',
                'timer',
                'order',
                'cash deposit',
                'cash withdrawal',
                'other'
            ),
            allowNull: true,
            comment: 'Specific type of transaction for detailed categorization',
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Transaction amount',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Optional description or note about the transaction',
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Date of the transaction',
        },
        reconciliationDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Optional reconciliation date for closing the cash flow',
        },
        balanceAfterTransaction: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Treasury balance after this transaction',
        },
        cashInMachineBefore: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cash available in the cashier machine before the transaction',
        },
        cashInMachineAfter: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Cash available in the cashier machine after the transaction',
        },
        paymentMethod: {
            type: DataTypes.ENUM('cash', 'visa'),
            allowNull: false,
            comment: 'Type of paymentMethod: cash or visa',
        },
    },
    {
        sequelize,
        modelName: 'Treasury',
        tableName: 'treasuries',
        timestamps: true,
        underscored: true,
        comment: 'Tracks all cash flow, income, and expenses with detailed categorization',
    }
);

module.exports = Treasury
