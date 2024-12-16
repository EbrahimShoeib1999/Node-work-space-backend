const Joi = require('joi');

const orderValidationSchema = Joi.object({
  clientId: Joi.string().required(),
  status: Joi.string().valid('PENDING', 'PAID', 'CANCELED').required(),
  totalCost: Joi.number().required(),
});

const orderItemValidationSchema = Joi.object({
  orderId: Joi.string().required(),
  inventoryId: Joi.string().required(),
  quantity: Joi.number().positive().required(),
});

module.exports = {
  orderValidationSchema,
  orderItemValidationSchema,
};
