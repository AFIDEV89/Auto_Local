import { validations } from '../../common/joi.js';

export const createColor = {
  name: validations.string,
  image: validations.optional_string,
  hexadecimal_code: validations.optional_length(7),
};

export const updateColor = {
  id: validations.positive_integer,
  ...createColor
};

export const deleteColor = {
  id: validations.positive_integer,
};
