const Joi = require('joi');

// Define Joi validation schema
const treasuryValidationSchema = Joi.object({
    transactionType: Joi.string()
        .valid('income', 'expense')
        .required()
        ,
    specificType: Joi.string()
        .valid(
            'sales',
            'suppliers payment',
            'salary payment',
            'rent',
            'utilities',
            'maintenance',
            'timer',
            'order',
            // 'cash deposit',
            // 'cash withdrawal',
            'other'
        )
        .required()
        ,
    amount: Joi.number()
        .greater(0)
        .precision(2)
        .required()
        ,
    description: Joi.string()
        .max(255)
        .optional()
        ,
    paymentMethod : Joi.string()
        .valid(
            "cash",
            "visa"
        )
        .required()
    ,
    supplierId: Joi.when('specificType', {
        is: 'suppliers payment',
        then: Joi
            .string()
            .guid({ version: 'uuidv4' })
            .required(), // `supplierId` is required when `specificType` is `suppliers payment`
        otherwise: Joi.forbidden() // Not allowed for other `specificType` values
    }),

    adminUserId: Joi.when('specificType', {
        then: Joi
            .string()
            .guid({ version: 'uuidv4' })
            .required(), // `supplierId` is required when `specificType` is `suppliers payment`
        otherwise: Joi.forbidden() // Not allowed for other `specificType` values
    }),
});

const cashMachineValidationSchema = Joi.object({

    specificType: Joi.string()
        .valid(
            'cash deposit',
            'cash withdrawal',
        )
        .required()
    ,
    amount: Joi.number()
        .greater(0)
        .precision(2)
        .required()
    ,
    description: Joi.string()
        .max(255)
        .optional()

});


module.exports = {treasuryValidationSchema,cashMachineValidationSchema};
