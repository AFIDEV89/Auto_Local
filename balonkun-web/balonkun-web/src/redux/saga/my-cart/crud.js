import { call, put } from 'redux-saga/effects';

import * as actions from '@redux/actions';
import * as services from '@services';
import { errorAlert, successAlert } from '@utils';

export function* cartProductCreate(action) {
  try {
    const response = yield call(services.cartProductCreate, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 201) {
      successAlert(message);
      action.callback(data);
      const count = yield call(services.getCartProductCount);
      yield put(actions.getCartProductCountSuccess(count.data.data));
    } else {
      errorAlert(message);
      action.callback(false);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback(false);
  }
}

export function* cartProductDelete(action) {
  try {
    const response = yield call(services.cartProductDelete, action.payload);
    const { statusCode, data = {} } = response?.data || {};
    if (statusCode === 204) {
      const count = yield call(services.getCartProductCount);
      yield put(actions.getCartProductCountSuccess(count.data.data));
      action.callback(data);
    } else {
      action.callback(false);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback(false);
  }
}

export function* cartProductUpdate(action) {
  try {
    const response = yield call(services.cartProductUpdate, action.payload);
    const { statusCode, data = {} } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      action.callback(false);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback(false);
  }
}

export function* getCartProductListRequest(action) {
  try {
    const response = yield call(services.getCartProductList);
    const { statusCode, message, data = [] } = response?.data || {};
    if (statusCode == 200) {
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback([]);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback([]);
  }
}

export function* getCartProductCount(action) {
  try {
    const response = yield call(services.getCartProductCount);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      yield put(actions.getCartProductCountSuccess(data));
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

