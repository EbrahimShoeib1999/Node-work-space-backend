const Joi = require('joi');

const inventoryValidationSchema = Joi.object({
  name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 255 characters',
        'any.required': 'Name is required',
      }),

  supplierId: Joi.string()
      .guid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': 'Supplier ID must be a valid UUID',
        'any.required': 'Supplier ID is required',
      }),

  unitType: Joi.string()
      .valid('piece', 'gram', 'kilogram', 'litre')
      .required()
      .messages({
        'string.base': 'Unit Type must be a string',
        'any.only': 'Unit Type must be one of: piece, gram, kilogram, litre',
        'any.required': 'Unit Type is required',
      }),

  stockQuantity: Joi.number()
      .greater(0)
      .required()
      .messages({
        'number.base': 'Stock Quantity must be a number',
        'number.greater': 'Stock Quantity must be greater than 0',
        'any.required': 'Stock Quantity is required',
      }),

  unitBuyingPrice: Joi.number()
      .greater(0)
      .required()
      .messages({
        'number.base': 'Unit Buying Price must be a number',
        'number.greater': 'Unit Buying Price must be greater than 0',
        'any.required': 'Unit Buying Price is required',
      }),

  totalBuyingPrice: Joi.number()
      .greater(0)
      .required()
      .messages({
        'number.base': 'Total Buying Price must be a number',
        'number.greater': 'Total Buying Price must be greater than 0',
        'any.required': 'Total Buying Price is required',
      }),

  sellingPricePerUnit: Joi.number()
      .greater(0)
      .required()
      .messages({
        'number.base': 'Selling Price per Unit must be a number',
        'number.greater': 'Selling Price per Unit must be greater than 0',
        'any.required': 'Selling Price per Unit is required',
      }),
});

const inventoryUpdateValidationSchema = Joi.object({
    supplierId: Joi.string().uuid().required().messages({
        'string.base': 'supplierId should be a string',
        'string.uuid': 'supplierId must be a valid UUID',
        'any.required': 'supplierId is required'
    }),
    quantity: Joi.number().positive().required().messages({
        'number.base': 'quantity should be a number',
        'number.positive': 'quantity must be a positive number',
        'any.required': 'quantity is required'
    }),
    totalBuyingPrice: Joi.number().positive().required().messages({
        'number.base': 'totalBuyingPrice should be a number',
        'number.positive': 'totalBuyingPrice must be a positive number',
        'any.required': 'totalBuyingPrice is required'
    })
});

module.exports = { inventoryValidationSchema, inventoryUpdateValidationSchema };
