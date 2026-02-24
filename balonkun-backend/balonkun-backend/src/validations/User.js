import joiInstance from './Joi.js';
import { IdValidation } from './Common.js';

const passwordRegex = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})";

export const email = joiInstance.object().keys({
  email: joiInstance.string().email().required(),
});

export const getUserRefrehToken = joiInstance.object().keys(IdValidation);

export const verifyUserEmail = joiInstance.object().keys({
  token: joiInstance.string().required(),
});

export const ResetUserPassword = joiInstance.object().keys({
  token: joiInstance.string().required(),
  password: joiInstance.string().required().pattern(new RegExp(passwordRegex)),
});

export const userLogin = joiInstance.object().keys({
  email: joiInstance.string().email().required(),
  password: joiInstance.string().required(),
});

export const userUpdate = joiInstance.object().keys({
  id:joiInstance.number().optional(),
  first_name: joiInstance.string().optional(),
  last_name: joiInstance.string().optional(),
  type: joiInstance.string().optional(),
  status: joiInstance.string().optional(),
  email:joiInstance.string().email().optional(),
  vehicle_type_id: joiInstance.number().optional(),
  vehicle_brand_id: joiInstance.number().optional(),
  password: joiInstance.string().optional(),
  mobile_no: joiInstance.string().length(10).optional(),
  vehicle_brand_model_id: joiInstance.number().optional(),
  is_phone_verified: joiInstance.boolean().optional()
});

export const ChangeUserPassword = joiInstance.object().keys({
  current_password: joiInstance.string().required(),
  new_password: joiInstance.string().required().pattern(new RegExp(passwordRegex)),
});
