import { call } from 'redux-saga/effects';

import * as services from '@services';
import { errorAlert } from '@utils';

export function* getProductListRequest(action) {
  try {
    const response = yield call(services.getProductList, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback();
    }
  } catch (e) {
    errorAlert('server error');
    action.callback();
  }
}

export function* getProductRequest(action) {
  try {
    const response = yield call(services.getProduct, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      action.errorCb()
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getProductReviewsRequest(action) {
  try {
    const response = yield call(services.getProductReviews, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getListingSEOData(action) {
  try {
    const response = yield call(services.getListingSEOData, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getFooterSEOData(action) {
  try {
    const response = yield call(services.getFooterSEOData, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 201 || statusCode === 200) {
      action.callback(data);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}