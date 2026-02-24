import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as placedOrderSaga from './placedOrder';

function* orderSaga() {
  yield takeLatest(
    actions.PLACED_ORDER_CREATE,
    placedOrderSaga.placedOrderCreate
  );
}

export default orderSaga;
