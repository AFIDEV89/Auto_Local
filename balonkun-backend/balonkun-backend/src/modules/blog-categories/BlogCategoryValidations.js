import { validations } from '../../common/joi.js';

export const createBlogCategory = {
  name: validations.string,
};

export const updateBlogCategory = {
  id: validations.positive_integer,
  ...createBlogCategory
};

export const deleteBlogCategory = {
  id: validations.positive_integer,
};
