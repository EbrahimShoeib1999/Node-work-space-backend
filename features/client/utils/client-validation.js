const Joi = require("joi");

const payValidationSchema = Joi.object({
  paymentMethod : Joi.string()
      .valid('cash', 'visa')
      .required()
      .messages({
        "any.only": "Invalid Payment Method. Must be one of cash, visa.",
        "string.empty": "Payment Method is required.",
      }),
});

// Validation schema
const clientValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters."
  }),
  contactInfo: Joi.string().max(100).optional().messages({
    "string.max": "Contact information must not exceed 100 characters."
  })
});

const updateClientValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters."
  }),
  contactInfo: Joi.string().max(100).optional().messages({
    "string.max": "Contact information must not exceed 100 characters."
  })
});

module.exports = { clientValidationSchema,updateClientValidationSchema ,payValidationSchema};