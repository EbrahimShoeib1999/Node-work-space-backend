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
    paymentMethod : Joi.string()
        .valid('cash', 'visa')
        .required()
        .messages({
            "any.only": "Invalid Payment Method. Must be one of cash, visa.",
            "string.empty": "Payment Method is required.",
        }),
});


module.exports = { timerValidationSchema,payTimerValidationSchema };
