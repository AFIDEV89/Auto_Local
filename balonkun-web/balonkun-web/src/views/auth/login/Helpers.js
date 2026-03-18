import { emailValidator, passwordValidator } from '@utils';

import { FIELD_LIST } from './Config';

export const validateDetail = (data) => {
  const errors = {};
  if (!data[FIELD_LIST.EMAIL]) {
    errors[FIELD_LIST.EMAIL] = 'Please enter email';
  } else if (!emailValidator(data[FIELD_LIST.EMAIL])) {
    errors[FIELD_LIST.EMAIL] = 'Please enter valid email';
  }
  if (!data[FIELD_LIST.PASSWORD]) {
    errors[FIELD_LIST.PASSWORD] = 'Please enter password';
  } else if (!passwordValidator(data[FIELD_LIST.PASSWORD])) {
    errors[FIELD_LIST.PASSWORD] = 'Password must contain at least 1 lower, upper, numeric, special character and min 8 characters long';
  }

  return errors;
};
