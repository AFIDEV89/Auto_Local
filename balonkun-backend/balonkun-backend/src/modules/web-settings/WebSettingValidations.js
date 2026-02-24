import { validations } from '../../common/joi.js';

export const createWebSettings = {
  banners_limit: validations.optional_positive_integer,
  dashboard_products_limit: validations.optional_positive_integer,
};

export const updateWebSettings = {
  id: validations.positive_integer,
  ...createWebSettings
};
