import { validations } from '../../common/joi.js';

export const createVehicleCategory = {
  name: validations.string,
};

export const updateVehicleCategory = {
  id: validations.positive_integer,
  ...createVehicleCategory
};

export const deleteVehicleCategory = {
  id: validations.positive_integer,
};
