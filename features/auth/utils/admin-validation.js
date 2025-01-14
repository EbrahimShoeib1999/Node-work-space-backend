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
    }),
  dailyRate: Joi.number()
      .min(0) // Ensures the rate is not negative (or customize this further)
      .optional() // Makes it optional if not provided
      .messages({
        "number.base": "Daily rate must be a number.",
        "number.min": "Daily rate must be a positive number.",
      })
});

const updateAdminUserValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30)
        .optional() // Makes it optional if not provided
        .messages({
        "string.empty": "Username is required.",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username must not exceed 30 characters.",
    }),
    email: Joi.string().email()
        .optional() // Makes it optional if not provided
        .messages({
        "string.empty": "Email is required.",
        "string.email": "Please provide a valid email address.",
    }),
    role: Joi.string()
        .valid(...Object.values(Roles))
        .optional() // Makes it optional if not provided
        .messages({
            "any.only": "Invalid role. Must be one of ADMIN, CASHIER, or USER.",
            "string.empty": "Role is required.",
        }),
    dailyRate: Joi.number()
        .min(0) // Ensures the rate is not negative (or customize this further)
        .optional() // Makes it optional if not provided
        .messages({
            "number.base": "Daily rate must be a number.",
            "number.min": "Daily rate must be a positive number.",
        })
});

const updateAdminUserPasswordValidationSchema = Joi.object({
    oldPassword: Joi.string().min(8)
        .required() // Makes it optional if not provided
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
        }),
    newPassword: Joi.string().min(8)
        .required() // Makes it optional if not provided
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
        }),
    confirmNewPassword: Joi.string().min(8)
        .required() // Makes it optional if not provided
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
        })
});

const updateAdminUserProfileValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30)
        .optional() // Makes it optional if not provided
        .messages({
            "string.empty": "Username is required.",
            "string.min": "Username must be at least 3 characters long.",
            "string.max": "Username must not exceed 30 characters.",
        }),
    email: Joi.string().email()
        .optional() // Makes it optional if not provided
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please provide a valid email address.",
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
  updateAdminUserValidationSchema,
  adminUserLoginValidationSchema,
  Roles,
    updateAdminUserPasswordValidationSchema,
    updateAdminUserProfileValidationSchema
};
