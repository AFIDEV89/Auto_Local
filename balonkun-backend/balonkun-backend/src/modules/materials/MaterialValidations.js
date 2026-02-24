import { validations } from '../../common/joi.js';

export const createMaterial = {
  name: validations.string,
  image: validations.optional_string,
};

export const updateMaterial = {
  id: validations.positive_integer,
  ...createMaterial
};

export const deleteMaterial = {
  id: validations.positive_integer,
};
