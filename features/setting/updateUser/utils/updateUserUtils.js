const Joi = require('joi');

const validateUserUpdate = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

module.exports = {validateUserUpdate}