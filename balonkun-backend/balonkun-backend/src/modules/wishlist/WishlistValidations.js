import { validations } from '../../common/joi.js';

export const updateWishlist = {
  id: validations.positive_integer,
};
