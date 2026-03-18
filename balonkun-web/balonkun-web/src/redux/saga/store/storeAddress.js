import { call } from 'redux-saga/effects';

import * as services from '@services';
import { errorAlert } from '@utils';

export function* getStoreAddressRequest(action) {
  try {
    const response = yield call(
      services.getStoreAddressRequest,
      action.payload
    );
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
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
