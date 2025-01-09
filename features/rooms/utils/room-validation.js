const Joi = require("joi");

const roomValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string.",
        "any.required": "Name is required.",
    }),
    capacity: Joi.number().integer().positive().required().messages({
        "number.base": "Capacity must be a number.",
        "number.positive": "Capacity must be a positive number.",
        "any.required": "Capacity is required.",
    }),
    status: Joi.string()
        .valid("AVAILABLE", "NOT_AVAILABLE")
        .default("AVAILABLE")
        .messages({
            "any.only": "Status must be either AVAILABLE or NOT_AVAILABLE.",
        }),
    hourlyRate: Joi.number().positive().required().messages({
        "number.base": "Hourly rate must be a number.",
        "number.positive": "Hourly rate must be a positive number.",
        "any.required": "Hourly rate is required.",
    }),
});

const updateRoomValidationSchema = Joi.object({
    name: Joi.string().optional(),
    capacity: Joi.number().integer().positive().optional(),
    status: Joi.string().valid("AVAILABLE", "NOT_AVAILABLE").optional(),
    hourlyRate: Joi.number().positive().optional(),
});

module.exports = { roomValidationSchema, updateRoomValidationSchema };
