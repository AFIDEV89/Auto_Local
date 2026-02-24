import { passwordValidator } from '@utils';

import { FIELD_LIST } from './Config';

export const validateDetail = (data) => {
  const errors = {};
  if (!data[FIELD_LIST.CURRENT_PASSWORD]) {
    errors[FIELD_LIST.CURRENT_PASSWORD] = 'Please enter current password';
  } else if (!passwordValidator(data[FIELD_LIST.CURRENT_PASSWORD])) {
    errors[FIELD_LIST.CURRENT_PASSWORD] = 'Password must contain at least 1 lower, upper, numeric, special character and min 8 characters long';
  }
  else if (data[FIELD_LIST.CURRENT_PASSWORD] == data[FIELD_LIST.NEW_PASSWORD]) {
    errors[FIELD_LIST.CURRENT_PASSWORD] = 'Please does not same';

  }
  if (!data[FIELD_LIST.NEW_PASSWORD]) {
    errors[FIELD_LIST.NEW_PASSWORD] = 'Please enter new password';
  } else if (!passwordValidator(data[FIELD_LIST.NEW_PASSWORD])) {
    errors[FIELD_LIST.PASSWORD] = 'Password must contain at least 1 lower, upper, numeric, special character and min 8 characters long';
  }
  if (!data[FIELD_LIST.CONFIRM_PASSWORD]) {
    errors[FIELD_LIST.CONFIRM_PASSWORD] = 'Please enter confirm password';
  } else if (data[FIELD_LIST.NEW_PASSWORD] !== data[FIELD_LIST.CONFIRM_PASSWORD]) {
    errors[FIELD_LIST.CONFIRM_PASSWORD] = 'Password does not match';
  }
  return errors;
};
