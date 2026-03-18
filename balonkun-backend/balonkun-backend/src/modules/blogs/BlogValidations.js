import { validations } from '../../common/joi.js';

export const createBlog = {
  title: validations.string,
  image: validations.string,
  creator_name: validations.optional_string,
  description: validations.string,
  content: validations.string,
  blog_category_id: validations.positive_integer,
  blog_author_id: validations.positive_integer,
};

export const updateBlog = {
  id: validations.positive_integer,
  ...createBlog
};

export const deleteBlog = {
  id: validations.positive_integer,
};

export const getBlog = {
  id: validations.positive_integer,
};
