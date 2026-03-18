import { validations } from '../../common/joi.js';

export const createDesign = {
  name: validations.string,
  image: validations.optional_allow_null_string, // TODO: in future we will remove image
  pictures: validations.optional_array_of_allow_null_strings,
};

export const updateDesign = {
  id: validations.positive_integer,
  ...createDesign
};

export const deleteDesign = {
  id: validations.positive_integer,
};
