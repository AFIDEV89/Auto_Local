import { validations } from '../../common/joi.js';

export const createBrandModel = {
  name: validations.string,
  brand_id: validations.positive_integer,
  vehicle_type_id: validations.optional_positive_integer
};

export const updateBrandModel = {
  id: validations.positive_integer,
  ...createBrandModel
};

export const deleteBrandModel = {
  id: validations.positive_integer,
};

export const getBrandModelList = {
  brand_id: validations.optional_positive_integer,
  vehicle_type_id: validations.optional_positive_integer,
  ...validations.optional_pagination
};
