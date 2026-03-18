import { validations } from '../../common/joi.js';

export const createProductCategory = {
  name: validations.string,
  image: validations.string,
};

export const updateProductCategory = {
  id: validations.positive_integer,
  ...createProductCategory
};

export const deleteProductCategory = {
  id: validations.positive_integer,
};
