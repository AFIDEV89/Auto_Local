import { all } from 'redux-saga/effects';

import bannerSaga from './banner';
import categorySaga from './category';
import myCartSaga from './my-cart';
import orderSaga from './order';
import productSaga from './product';
import storeSaga from './store';
import userSaga from './user';
import vehicleSaga from './vehicle';
import blogSaga from './blog';

export default function* rootSaga() {
  yield all([
    bannerSaga(),
    categorySaga(),
    myCartSaga(),
    orderSaga(),
    productSaga(),
    storeSaga(),
    userSaga(),
    vehicleSaga(),
    blogSaga()
  ]);
}

