const Joi = require("joi");

// Validation schema for OrderItem
const orderItemValidationSchema = Joi.object({
  quantity: Joi.number().positive().precision(2).required().messages({
    "number.base": "Quantity must be a number.",
    "number.positive": "Quantity must be a positive number.",
    "number.precision": "Quantity must have up to 2 decimal places.",
    "any.required": "Quantity is required."
  }),
  totalPrice: Joi.number().positive().precision(2).required().messages({
    "number.base": "Total price must be a number.",
    "number.positive": "Total price must be a positive number.",
    "number.precision": "Total price must have up to 2 decimal places.",
    "any.required": "Total price is required."
  })
});

// Validation schema for Order
const orderValidationSchema = Joi.object({
  id: Joi.number().positive().optional().messages({
    "number.base": "ID must be a number.",
    "number.positive": "ID must be a positive number."
  }),
  orderItems: Joi.array().items(orderItemValidationSchema).min(1).required().messages({
    "array.base": "Order items must be an array.",
    "array.min": "At least one order item is required.",
    "any.required": "Order items are required."
  })
});

module.exports = {
  orderValidationSchema,
  orderItemValidationSchema
};