import joiInstance from './Joi.js';

export const CreateProduct = joiInstance.object().keys({
  name: joiInstance.string().required(),
});

export const UpdateProduct = joiInstance.object().keys({
  id: joiInstance.number().required().min(1).messages({
    'number.min': "Please enter valid id",
    'any.required': "Id is required",
  }),
  name: joiInstance.string().required(),
});
