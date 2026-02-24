import { validations } from '../../common/joi.js';

export const createBanner = {
  title: validations.optional_allow_null_string,
  image: validations.string,
  url: validations.string,
};

export const updateBanner = {
  id: validations.positive_integer,
  ...createBanner
};

export const deleteBanner = {
  id: validations.positive_integer,
};
