import { call, takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';
import * as services from '@services';
import { errorAlert } from '@utils';

function* getBannerListRequest(action) {
  try {
    const response = yield call(services.getBannerList);
    const { statusCode, message, data = [] } = response?.data || {};
    if (statusCode == 200) {
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback([]);
    }
  } catch (e) {
    errorAlert("server error");
    action.callback([]);
  }
}

function* bannerSaga() {
  yield takeLatest(actions.GET_BANNER_LIST_REQUEST, getBannerListRequest);
}

export default bannerSaga;

