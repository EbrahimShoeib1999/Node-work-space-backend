const Joi = require("joi");

// Validation schema
const inventoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters."
  }),
  unitType: Joi.string()
    .valid("piece", "gram")
    .required()
    .messages({
      "any.only": "Unit type must be one of 'piece' or 'gram'.",
      "string.empty": "Unit type is required."
    }),
  stockQuantity: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Stock quantity must be a valid number.",
    "number.min": "Stock quantity cannot be negative.",
    "any.required": "Stock quantity is required."
  }),
  pricePerUnit: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Price per unit must be a valid number.",
    "number.min": "Price per unit cannot be negative.",
    "any.required": "Price per unit is required."
  })
});

module.exports = { inventoryValidationSchema };
