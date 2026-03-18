import { call, put } from 'redux-saga/effects';

import * as actions from '@redux/actions';
import * as services from '@services';

export function* getVehicleTypeListRequest(action) {
  try {
    const response = yield call(services.getVehicleTypeList);
    if (response?.data.statusCode === 200) {
      action.callback(response.data.data || []);
      yield put(actions.getVehicleTypeListSuccess(response?.data?.data));
    } else {
      action.callback([]);
    }
  } catch (e) {
    action.callback([]);
  }
}

export function* getVehicleDetailListRequest(action) {
  try {
    const response = yield call(services.getVehicleDetailList);
    if (response?.data.statusCode === 200) {
      action.callback(response.data.data || []);
    } else {
      action.callback([]);
    }
  } catch (e) {
    action.callback([]);
  }
}
