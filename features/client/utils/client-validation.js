const Joi = require("joi");

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

module.exports = { clientValidationSchema };