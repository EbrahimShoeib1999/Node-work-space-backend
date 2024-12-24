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
