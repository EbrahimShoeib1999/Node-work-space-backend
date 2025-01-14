const Joi = require("joi");

const orderItemSchema = Joi.object({
  inventoryItemId: Joi.string().uuid().required().messages({
    "string.base": "Inventory item ID must be a string.",
    "string.uuid": "Inventory item ID must be a valid UUID.",
    "any.required": "Inventory item ID is required.",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a number.",
    "number.positive": "Quantity must be greater than zero.",
    "any.required": "Quantity is required.",
  }),
});

const createOrderSchema = Joi.object({
  clientId: Joi.string().uuid().required().messages({
    "string.base": "Client ID must be a string.",
    "string.uuid": "Client ID must be a valid UUID.",
    "any.required": "Client ID is required.",
  }),
  orderItems: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.base": "Order items must be an array.",
    "array.min": "At least one order item is required.",
    "any.required": "Order items are required.",
  }),
});

const addOrderItemSchema = Joi.object({
  orderId: Joi.string().uuid().required().messages({
    "string.base": "Order ID must be a string.",
    "string.uuid": "Order ID must be a valid UUID.",
    "any.required": "Order ID is required.",
  }),
  inventoryItemId: Joi.string().uuid().required().messages({
    "string.base": "Inventory item ID must be a string.",
    "string.uuid": "Inventory item ID must be a valid UUID.",
    "any.required": "Inventory item ID is required.",
  }),
  quantity: Joi.number().positive().required().messages({
    "number.base": "Quantity must be a number.",
    "number.positive": "Quantity must be greater than zero.",
    "any.required": "Quantity is required.",
  }),
});

const paymentSchema = Joi.object({
  paymentMethod: Joi.string().valid("visa", "cash").required().messages({
    "string.base": "Payment method must be a string.",
    "any.only": "Payment method must be 'visa' or 'cash'.",
    "any.required": "Payment method is required.",
  }),
});

module.exports = {
  createOrderSchema,
  addOrderItemSchema,
  paymentSchema,
};
