import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as getBlogSaga from './blog';

function* blogSaga() {
	yield takeLatest(actions.GET_DASHBOARD_BLOG_LIST_REQUEST, getBlogSaga.getDashboardBlogListRequest);
    yield takeLatest(actions.GET_BLOG_LIST_REQUEST, getBlogSaga.getBlogListRequest);
    yield takeLatest(actions.GET_BLOG_REQUEST, getBlogSaga.getBlogRequest);
    yield takeLatest(actions.GET_CATEGORY_BLOGS, getBlogSaga.getCategoriesBlogsRequest)
    yield takeLatest(actions.GET_CATEGORIES, getBlogSaga.getCategoriesRequest)
    yield takeLatest(actions.GET_POPULAR_BLOGS, getBlogSaga.getPopularBlogsRequest)
    yield takeLatest(actions.GET_HEADER_BLOG, getBlogSaga.getHeaderBlogRequest)
}

export default blogSaga;