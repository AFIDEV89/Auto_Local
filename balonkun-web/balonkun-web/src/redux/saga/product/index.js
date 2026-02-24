import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as getProductSaga from './product';

function* productSaga() {
	yield takeLatest(actions.GET_PRODUCT_REQUEST, getProductSaga.getProductRequest);
	yield takeLatest(actions.GET_PRODUCT_LIST_REQUEST, getProductSaga.getProductListRequest);
	yield takeLatest(actions.GET_PRODUCT_REVIEWS, getProductSaga.getProductReviewsRequest);
	yield takeLatest(actions.GET_LISTING_SEO_DATA, getProductSaga.getListingSEOData);
	yield takeLatest(actions.GET_FOOTER_SEO_DATA, getProductSaga.getFooterSEOData);

}

export default productSaga;
