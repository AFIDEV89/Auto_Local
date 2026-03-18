import { call, put } from 'redux-saga/effects';

import * as actions from '@redux/actions';
import * as services from '@services';
import { errorAlert, successAlert } from '@utils';

export function* getLoginRequest(action) {
  try {
    const response = yield call(services.getLoginRequest, action.payload);
    const { statusCode, message, data = {} } = response?.data || {};
    if (statusCode === 200) {
      successAlert(message);
      yield put(actions.getLoginSuccess(data));
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback({});
    }
  } catch (e) {
    errorAlert('server error');
    action.callback({});
  }
}

export function* getSignUpRequest(action) {
  try {
    const response = yield call(services.getSignUpRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 201) {
      action.callback(true);
      successAlert(message);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getLogoutRequest() {
  try {
    const response = yield call(services.getLogoutRequest);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 204) {
      successAlert(message);
      yield put(actions.getLogoutSuccess());
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getChangePasswordRequest(action) {
  try {
    const response = yield call(services.getChangePasswordRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 204) {
      successAlert(message);
      action.callback(true);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getForgotPasswordRequest(action) {
  try {
    const response = yield call(services.getForgotPasswordRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 200) {
      successAlert(message);
      action.callback(true);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* updateUserProfileRequest(action) {
  try {
    const response = yield call(services.updateUserProfileRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 204) {
      successAlert(message);
      yield put(actions.updateUserProfileSuccess(action.payload));
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getResetPasswordRequest(action) {
  try {
    const response = yield call(services.getResetPasswordRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 204) {
      successAlert(message);
      action.callback(true);
    } else {
      errorAlert(message);
    }
  } catch (e) {
    errorAlert('server error');
  }
}

export function* getVerifyEmailRequest(action) {
  try {
    const response = yield call(services.getVerifyEmailRequest, action.payload);
    const { statusCode, message } = response?.data || {};
    if (statusCode === 204) {
      action.callback(true);
      successAlert(message);
    } else {
      errorAlert(message);
      action.callback(false);
    }
  } catch (e) {
    errorAlert("server error");
    action.callback(false);
  }
}
