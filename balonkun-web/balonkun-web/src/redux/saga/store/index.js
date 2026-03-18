import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as storeAddressSaga from './storeAddress';

function* storeSaga() {
  yield takeLatest(
    actions.GET_STORE_ADDRESS_REQUEST,
    storeAddressSaga.getStoreAddressRequest
  );
}

export default storeSaga;
