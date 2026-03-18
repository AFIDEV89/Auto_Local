import { validations } from '../../common/joi.js';

export const getDashboardProducts = {
  category: validations.optional_string,
  vehicle_type: validations.optional_string,
};
