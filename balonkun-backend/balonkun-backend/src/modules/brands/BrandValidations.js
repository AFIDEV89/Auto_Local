import { validations } from '../../common/joi.js';

export const createBrand = {
  name: validations.string,
  vehicle_type_id: validations.optional_positive_integer
};

export const updateBrand = {
  id: validations.positive_integer,
  ...createBrand
};

export const deleteBrand = {
  id: validations.positive_integer,
};

export const getBrandList = {
  vehicle_type_id: validations.optional_positive_integer,
  ...validations.optional_pagination
};
