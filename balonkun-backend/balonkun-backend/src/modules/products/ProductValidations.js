import Joi from 'joi';
import { validations } from '../../common/joi.js';
import { model_values } from '../../constants/index.js';

const createProduct = {
  category_id: validations.positive_integer,
  subcategory_id: validations.optional_positive_integer,
  name: validations.string,
  ratings: validations.optional_positive_integer,
  pictures: validations.optional_array_of_strings,
  videos: validations.optional_array_of_strings,
  original_price: validations.positive_integer,
  discounted_price: validations.optional_positive_integer,
  detail: validations.optional_string,
  description: validations.string,
  product_code: validations.string,
  availability: validations.enum(model_values.product.availability),
  quantity: validations.positive_integer,
  reviews: validations.any_json.optional(),
  tags: validations.optional_array_of_strings,
  suggestions: validations.array_of_positive_integers.optional(),
  additional_info: validations.string,
  is_latest: validations.optional_boolean,
  is_trending: validations.optional_boolean,
  seo_title: validations.optional_allow_null_string,
  seo_canonical: validations.optional_allow_null_string,
  seo_description: validations.optional_allow_null_string,
  model_variant: validations.optional_string,
  vehicle_detail: validations.nested_details({
    vehicle_type_id: validations.positive_integer,
    brand_id: validations.optional_allow_null_positive_integer,
    model_id: validations.optional_allow_null_positive_integer,
    model_variant: validations.optional_string,
    vehicle_category_id: validations.optional_positive_integer,
  }),
  variants: validations.product.creating_variants.optional(),
};

const updateProduct = {
  id: validations.positive_integer,
  category_id: validations.optional_positive_integer,
  name: validations.optional_string,
  ratings: validations.optional_positive_integer,
  pictures: validations.optional_array_of_strings,
  videos: validations.optional_array_of_strings,
  original_price: validations.optional_positive_integer,
  discounted_price: validations.optional_positive_integer,
  detail: validations.optional_string,
  description: validations.optional_string,
  product_code: validations.optional_string,
  availability: validations.enum(model_values.product.availability).optional(),
  quantity: validations.optional_positive_integer,
  reviews: validations.any_json.optional(),
  tags: validations.optional_array_of_strings,
  suggestions: validations.array_of_positive_integers.optional(),
  additional_info: validations.string.optional(),
  is_latest: validations.optional_boolean,
  is_trending: validations.optional_boolean,
  vehicle_type_id: validations.optional_allow_null_positive_integer,
  brand_id: validations.optional_allow_null_positive_integer,
  vehicle_category_id: validations.optional_allow_null_positive_integer,
  model_id: validations.optional_allow_null_positive_integer,
  seo_title: validations.optional_allow_null_string,
  seo_canonical: validations.optional_allow_null_string,
  seo_description: validations.optional_allow_null_string,
  model_variant: validations.optional_string,
  vehicle_detail: validations.nested_details({
    vehicle_type_id: validations.positive_integer,
    brand_id: validations.optional_allow_null_positive_integer,
    model_id: validations.optional_allow_null_positive_integer,
    model_variant: validations.optional_string,
    vehicle_category_id: validations.optional_positive_integer,
  }).optional(),
  variants: validations.product.updating_variants.optional(),
};

const deleteProduct = {
  id: validations.positive_integer,
};

const getProduct = {
  id: validations.positive_integer,
};

const getUserProduct = {
  id: validations.string,
  user_id: validations.optional_row_id_integer,
};

const getUserProductCanonical = {
  id: validations.string,
  user_id: validations.optional_row_id_integer,
};

const getProductGallery = {
  id: validations.positive_integer,
};

const getProductList = {
  ...validations.optional_pagination,
  search: validations.optional_string,
  filter_type: validations.optional_enum(Object.values(model_values.product.admin_listing_filters)),
  filter_id: validations.optional_positive_integer,
  vehicles: Joi.any().optional(),
  product_categories: Joi.any().optional(),
  colors: Joi.any().optional(),
  price: Joi.any().optional(),
  rating: Joi.any().optional(),
};

const getUserProductList = {
  ...validations.optional_pagination,
  search: validations.optional_string,
  filters: validations.any_json,
  sort_by: validations.optional_enum(['original_price']),
  sort_order: validations.optional_enum(['DESC', 'ASC']),
  filter_by: validations.optional_enum(['trending', 'latest']),
  user_id: validations.optional_row_id_integer,
};

const getRelatedProductList = {
  ...validations.optional_pagination,
  product_category_id: validations.positive_integer,
  user_id: validations.optional_row_id_integer,
};

const getProductPrice = {
  design_id: validations.optional_positive_integer,
  vehicle_category_id: validations.optional_positive_integer,
  brand_id: validations.optional_positive_integer,
};

const setHideShowProduct = {
  id: validations.positive_integer,
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  getProductGallery,
  getProduct,
  getUserProductList,
  getUserProduct,
  getRelatedProductList,
  getProductPrice,
  setHideShowProduct,
  getUserProductCanonical
};
