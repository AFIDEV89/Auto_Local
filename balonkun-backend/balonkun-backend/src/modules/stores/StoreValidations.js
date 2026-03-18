import { validations } from '../../common/joi.js';

export const createStore = {
  city: validations.string,
  contact_no: validations.contact_no,
  country: validations.string,
  email: validations.email,
  latitude: validations.latitude,
  longitude: validations.longitude,
  name: validations.string,
  postal_code: validations.postal_code,
  state: validations.string,
  street_address: validations.string,
};

export const updateStore = {
  id: validations.positive_integer,
  ...createStore
};

export const deleteStore = {
  id: validations.positive_integer,
};

export const getStore = {
  id: validations.positive_integer,
};

export const getStoreList = {
  ...validations.optional_pagination,
  latitude: validations.optional_latitude,
  longitude: validations.optional_longitude,
};
