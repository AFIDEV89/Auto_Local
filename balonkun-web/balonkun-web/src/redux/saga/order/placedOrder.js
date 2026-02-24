import { call } from 'redux-saga/effects';

import * as services from '@services';
import { errorAlert, successAlert } from '@utils';


export function* placedOrderCreate(action) {
  try {
    const response = yield call(services.placedOrderCreate, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 201) {
      successAlert(message);
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback(false);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback(false);
  }
}
