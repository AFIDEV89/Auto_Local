import { emailValidator, passwordValidator, mobileNumberValidator } from '@utils';

import { FIELD_LIST } from './Config';

export const validateDetail = (data) => {
  const errors = {};

  if (!data[FIELD_LIST.FIRST_NAME]) {
    errors[FIELD_LIST.FIRST_NAME] = 'Please enter first name';
  }

  if (!data[FIELD_LIST.LAST_NAME]) {
    errors[FIELD_LIST.LAST_NAME] = 'Please enter last name';
  }

  if (!data[FIELD_LIST.EMAIL]) {
    errors[FIELD_LIST.EMAIL] = 'Please enter email';
  } else if (!emailValidator(data[FIELD_LIST.EMAIL])) {
    errors[FIELD_LIST.EMAIL] = 'Please enter valid email';
  }

  if (!data[FIELD_LIST.MOBILE_NUMBER]) {
    errors[FIELD_LIST.MOBILE_NUMBER] = 'Please enter mobile number';
  } else if (!mobileNumberValidator(data[FIELD_LIST.MOBILE_NUMBER])) {
    errors[FIELD_LIST.MOBILE_NUMBER] = 'Please enter valid mobile number';
  }

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