'use strict';
import Joi from 'joi';
// import countriesAndStates from 'countries-and-states';

import * as constants from "../constants/index.js";
import * as utils from '../utils/index.js';
import responseCtr from '../common/messages/index.js';

function validateSchema(req, res, schema, cb, statusCode, message) {
  if (utils.isObject(schema)) {
    const data = { ...req.body, ...req.params, ...req.query };
    const errors = Joi.object().keys(schema).validate(data);
    const errorsToReturn = errors.error?.details?.map(
      error => error.message &&
        error.message.replace(/"/g, "") || ''
    ) || '';

    if (errorsToReturn) {
      return res.json({
        statusCode: constants.FAILURE,
        message: constants.BAD_REQUEST,
        errors: errorsToReturn
      });
    }
  }
  cb().then(data => {
    responseCtr({ res, statusCode, data, message });
  }).catch(err => {
    console.log("validateSchema-cb-catch", err);
    return res.json({
      statusCode: constants.FAILURE,
      message: constants.BAD_REQUEST,
      errors: err
    });
  });
};
// console.log("countriesAndStates", countriesAndStates.getCountries());
// const countrySchema = Joi.string().valid(...countriesAndStates.getCountries());
// const stateSchema = Joi.string().valid(...countriesAndStates.getStates());

const validations = Object.freeze({
  positive_integer: Joi.number().required().min(1),
  optional_positive_integer: Joi.number().optional().min(0),
  optional_allow_null_positive_integer: Joi.number().optional().min(1).allow(null),
  string: Joi.string().trim().required(),
  optional_string: Joi.string().trim().optional(),
  optional_allow_null_string: Joi.string().trim().optional().allow(null),
  optional_length: (val) => Joi.string().trim().min(val).max(val).required(),
  array_of_strings: Joi.array().items(Joi.string().trim().required()).required(),
  optional_array_of_strings: Joi.array().items(Joi.string().trim().required()).optional(),
  optional_array_of_allow_null_strings: Joi.array().items(Joi.string().trim().required()).optional().allow(null),
  optional_boolean: Joi.boolean().optional(),
  array_of_positive_integers: Joi.array().items(Joi.number().min(1)).required(),
  any_json: Joi.object().keys(),
  enum: (values = []) => Joi.string().trim().valid(...values),
  optional_enum: (values = []) => Joi.string().optional().trim().valid(...values),
  email: Joi.string().trim().email().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  optional_latitude: Joi.number().min(-90).max(90).optional(),
  optional_longitude: Joi.number().min(-180).max(180).optional(),
  postal_code: Joi.string().trim().pattern(/^\d{6}$/).required(),
  contact_no: Joi.string().pattern(/^\d{10}$/),
  rating: Joi.number().min(1).max(5).required(),
  // country: countrySchema.required(),
  // state: stateSchema.required(),
  pagination: {
    page: Joi.number().required().min(1),
    limit: Joi.number().required().min(1),
  },
  pagination_id: {
    id: Joi.number().required().min(1),
    page: Joi.number().required().min(1),
    limit: Joi.number().required().min(1),
  },
  optional_pagination: {
    page: Joi.number().optional().min(1),
    limit: Joi.number().optional().min(1),
  },
  product: {
    creating_variants: Joi.array().items(Joi.object().keys({
      design_id: Joi.number().optional().min(1).allow(null),
      material_id: Joi.number().optional().min(1).allow(null),
      major_color_id: Joi.number().optional().min(1).allow(null),
      minor_color_ids: Joi.array().unique().items(Joi.number().min(1).required()).optional().allow(null),
    })).optional(),
    updating_variants: Joi.array().items(Joi.object().keys({
      id: Joi.number().optional().min(1),
      design_id: Joi.number().optional().min(1).allow(null),
      material_id: Joi.number().optional().min(1).allow(null),
      major_color_id: Joi.number().optional().min(1).allow(null),
      minor_color_ids: Joi.array().unique().items(Joi.number().min(1).required()).optional().allow(null),
    })).optional(),
  },
  nested_details: (details) => Joi.object().keys(details).required(),
  optional_row_id_integer: Joi.number().optional().min(0),
});

export { validateSchema, validations };
