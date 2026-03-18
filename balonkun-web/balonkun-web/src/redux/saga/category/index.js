import { call, takeLatest } from 'redux-saga/effects'

import * as actions from '@redux/action-types';
import * as services from '@services'
import { errorAlert } from '@utils'

function* getCategoryListRequest(action) {
  try {
    const response = yield call(services.getCategoryList);
    const { statusCode, message, data = [] } = response?.data || {}
    if (statusCode == 200) {
      action.callback(data)
    } else {
      errorAlert(message)
      action.callback([])
    }
  } catch (e) {
    errorAlert("server error")
    action.callback([])
  }
}

function* categorySaga() {
  yield takeLatest(actions.GET_CATEGORY_LIST_REQUEST, getCategoryListRequest);
}

export default categorySaga;

