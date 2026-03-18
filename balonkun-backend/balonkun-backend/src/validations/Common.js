import joiInstance from './Joi.js';

export const IdValidation = {
  id: joiInstance.number().required().min(1).messages({
    'number.min': "Please enter valid id",
    'any.required': "Id is required",
  }),
};

export const RecordId = joiInstance.object().keys(IdValidation);
