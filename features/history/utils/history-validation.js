const Joi = require("joi");

const createTransactionValidationSchema = Joi.object({
    userId: Joi.string().uuid().required().messages({
        "any.required": "User ID is required.",
        "string.uuid": "User ID must be a valid UUID.",
    }),
    action: Joi.string()
        .valid(
            "ORDERED",
            "ORDER_PAID",
            "ORDER_DELETED",
            "SESSION_STARTED",
            "SESSION_ENDED",
            "SESSION_PAID",
            "RESERVATION",
            "RESERVATION_PAID",
            "RESERVATION_DELETED"
        )
        .required()
        .messages({
            "any.required": "Action is required.",
            "any.only": "Action must be one of the valid transaction types.",
        }),
    details: Joi.string().optional().allow(null, "").messages({
        "string.base": "Details must be a string.",
    }),
});

module.exports = { createTransactionValidationSchema };
