const Joi = require("joi");

// Validation for creating a reservation
const createReservationSchema = Joi.object({
    roomId: Joi.string().uuid().required().messages({
        "string.base": "Room ID must be a string.",
        "string.uuid": "Room ID must be a valid UUID.",
        "any.required": "Room ID is required.",
    }),
    clientId: Joi.string().uuid().required().messages({
        "string.base": "Client ID must be a string.",
        "string.uuid": "Client ID must be a valid UUID.",
        "any.required": "Client ID is required.",
    }),
    fromDate: Joi.date().required().messages({
        "date.base": "From Date must be a valid date.",
        "any.required": "From Date is required.",
    }),
    toDate: Joi.date().required().messages({
        "date.base": "To Date must be a valid date.",
        "any.required": "To Date is required.",
    }),
});

// Validation for reservation ID
const reservationIdSchema = Joi.object({
    reservationId: Joi.string().uuid().required().messages({
        "string.base": "Reservation ID must be a string.",
        "string.uuid": "Reservation ID must be a valid UUID.",
        "any.required": "Reservation ID is required.",
    }),
});

// Validation for client ID and room ID
const clientIdSchema = Joi.object({
    clientId: Joi.string().uuid().required().messages({
        "string.base": "Client ID must be a string.",
        "string.uuid": "Client ID must be a valid UUID.",
        "any.required": "Client ID is required.",
    }),
});

const roomIdSchema = Joi.object({
    roomId: Joi.string().uuid().required().messages({
        "string.base": "Room ID must be a string.",
        "string.uuid": "Room ID must be a valid UUID.",
        "any.required": "Room ID is required.",
    }),
});

module.exports = {
    createReservationSchema,
    reservationIdSchema,
    clientIdSchema,
    roomIdSchema,
};
