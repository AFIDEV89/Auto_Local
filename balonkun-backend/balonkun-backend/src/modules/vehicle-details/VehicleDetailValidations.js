import { validations } from '../../common/joi.js';

export const createVehicleDetail = {
  vehicle_type_id: validations.positive_integer,
  brand_id: validations.positive_integer,
  image: validations.optional_string,
  model_id: validations.positive_integer,
  month: validations.string,
  year: validations.string,
  model_variant: validations.string,
  vehicle_category_id: validations.positive_integer,
};

export const updateVehicleDetail = {
  id: validations.positive_integer,
  ...createVehicleDetail
};

export const deleteVehicleDetail = {
  id: validations.positive_integer,
};
