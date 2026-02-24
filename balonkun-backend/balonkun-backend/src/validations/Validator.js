import * as Utils from '../utils/index.js';

export const validateSchema = ({ schema, data }) => {
  if (schema) {
    const errors = schema.validate(data);
    return errors.error?.details?.map(
      error => error.message &&
        Utils.titleCase(
          error.message.replace(/\"/g, "").replace(/_/g, " ")
        )
    ) || '';
  }
  return '';
};
