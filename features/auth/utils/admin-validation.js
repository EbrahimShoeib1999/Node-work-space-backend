const Joi = require("joi");

// Enum definitions for validation
const Roles = {
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  USER: "USER",
};

// Validation schema
const adminUserValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
  }),
  role: Joi.string()
    .valid(...Object.values(Roles))
    .required()
    .messages({
      "any.only": "Invalid role. Must be one of ADMIN, CASHIER, or USER.",
      "string.empty": "Role is required.",
    })
});

const adminUserLoginValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must not exceed 30 characters.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
    })
  })

module.exports = {
  adminUserValidationSchema,
  adminUserLoginValidationSchema,
  Roles,
};
