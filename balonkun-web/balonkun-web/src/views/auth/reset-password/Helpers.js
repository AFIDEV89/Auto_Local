import { passwordValidator } from '@utils';

import { FIELD_LIST } from './Config';

export const validateDetail = (data) => {
  const errors = {};
  if (!data[FIELD_LIST.PASSWORD]) {
    errors[FIELD_LIST.PASSWORD] = 'Please enter password';
  } else if (!passwordValidator(data[FIELD_LIST.PASSWORD])) {
    errors[FIELD_LIST.PASSWORD] = 'Password must contain at least 1 lower, upper, numeric, special character and min 8 characters long';
  }
  if (!data[FIELD_LIST.CONFIRM_PASSWORD]) {
    errors[FIELD_LIST.CONFIRM_PASSWORD] = 'Please enter confirm password';
  } else if (data[FIELD_LIST.PASSWORD] !== data[FIELD_LIST.CONFIRM_PASSWORD]) {
    errors[FIELD_LIST.CONFIRM_PASSWORD] = 'Password does not match';
  }
  return errors;
};
