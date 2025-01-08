const Joi = require('joi');
const {DataTypes} = require("sequelize");

const timerValidationSchema = Joi.object({
    clientId: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .messages({
            'string.guid': 'Client ID must be a valid UUID',
            'any.required': 'Client ID is required',
        }),
    hourlyRate: Joi.number()
        .positive()
        .required()
        .messages({
            'string.guid': 'Hourly Rate must be positive',
            'any.required': 'Hourly Rate is required',
        }),
});

const payTimerValidationSchema = Joi.object({
    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'string.guid': 'amount must be positive',
            'any.required': 'amount is required',
        }),

    paymentMethod : Joi.string()
        .valid('income', 'expense')
        .required()
        .messages({
            "any.only": "Invalid Payment Method. Must be one of income, expense.",
            "string.empty": "Payment Method is required.",
        }),
});


module.exports = { timerValidationSchema,payTimerValidationSchema };
