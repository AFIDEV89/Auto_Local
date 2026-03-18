import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as crudSaga from './crud';

function* myCartSaga() {
  yield takeLatest(actions.CART_PRODUCT_CREATE, crudSaga.cartProductCreate);
  yield takeLatest(actions.CART_PRODUCT_DELETE, crudSaga.cartProductDelete);
  yield takeLatest(actions.CART_PRODUCT_UPDATE, crudSaga.cartProductUpdate);
  yield takeLatest(actions.GET_CART_PRODUCT_REQUEST, crudSaga.getCartProductListRequest);
  yield takeLatest(actions.GET_CART_PRODUCT_COUNT, crudSaga.getCartProductCount);
}

export default myCartSaga;
