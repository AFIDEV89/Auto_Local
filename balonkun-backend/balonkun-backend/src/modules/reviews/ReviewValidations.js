import { validations } from '../../common/joi.js';

const reviewCommonFields = {
  name: validations.string,
  image: validations.optional_array_of_strings,
  description: validations.string,
  rating: validations.rating
};

export const createReview = {
  product_id: validations.positive_integer,
  ...reviewCommonFields
};

export const updateReview = {
  id: validations.positive_integer,
  ...reviewCommonFields
};

export const deleteReview = {
  id: validations.positive_integer,
};

export const getReviewsByProductId = {
  id: validations.positive_integer,
};
