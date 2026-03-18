import { validations } from '../../common/joi.js';
import { ORDER_STATUS_LIST } from '../../constants/Modules.js';

export const createOrder = {
  store_id: validations.positive_integer,
};

export const getOrderList = {
  ...validations.optional_pagination,
  store_id: validations.optional_positive_integer,
  status: validations.optional_string
};

export const getOrder = {
  ...validations.optional_pagination,
};

export const updateOrderStatus = {
  id: validations.positive_integer,
  status: validations.enum(Object.values(ORDER_STATUS_LIST))
};

export const updateCourierDetail = {
  id: validations.positive_integer,
  courier_partner: validations.optional_allow_null_string,
  awb_no  : validations.optional_allow_null_string,
  comments: validations.optional_allow_null_string
};