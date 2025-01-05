const Joi = require('joi');

const supplierValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters.',
            'any.required': 'Name is a required field.',
        }),
    responsibleName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.min': 'Responsible name must be at least 3 characters.',
        }),
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // E.164 phone number format
        .required()
        .messages({
            'string.empty': 'Phone number is required.',
            'string.pattern.base': 'Phone number must be in a valid format.',
            'any.required': 'Phone number is a required field.',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
        }),
    niche: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Niche is required.',
            'string.min': 'Niche must be at least 3 characters.',
            'any.required': 'Niche is a required field.',
        }),
    address: Joi.string()
        .max(500)
        .required()
        .messages({
            'string.max': 'Address must not exceed 500 characters.',
        })
});

const updateSupplierValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters.',
            'any.required': 'Name is a required field.',
        }),
    responsibleName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Responsible name must be at least 3 characters.',
        }),
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // E.164 phone number format
        .optional()
        .messages({
            'string.empty': 'Phone is required.',
            'string.pattern.base': 'Phone must be in a valid format.',
            'any.required': 'Phone is a required field.',
        }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Email must be a valid email address.',
        }),
    niche: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.empty': 'Niche is required.',
            'string.min': 'Niche must be at least 3 characters.',
            'any.required': 'Niche is a required field.',
        }),
    address: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Address must not exceed 500 characters.',
        })
});

module.exports = { supplierValidationSchema,updateSupplierValidationSchema };
