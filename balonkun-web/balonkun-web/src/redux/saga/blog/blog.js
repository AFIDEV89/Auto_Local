import { call } from 'redux-saga/effects';

import * as services from '@services';
import { errorAlert } from '@utils';

export function* getDashboardBlogListRequest(action) {
  try {
    const response = yield call(services.getDashboardBlogList,action.payload);
    const { statusCode, message, data = [] } = response?.data || {};
    if (statusCode === 200) {
      action.callback(data);
    } else {
      errorAlert(message);
      action.callback([]);
    }
  } catch (e) {
    errorAlert('server error');
    action.callback([]);
  }
}

export function* getBlogListRequest(action) {
    try {
      const response = yield call(services.getBlogList,action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert('server error');
      action.callback([]);
    }
  }

  export function* getBlogRequest(action) {
    try {
      const response = yield call(services.getBlog,action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert(JSON.stringify(e));
      action.callback([]);
    }
  }

  export function* getCategoriesBlogsRequest(action) {
    try {
      const response = yield call(services.getCategoriesBlog, action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert(JSON.stringify(e));
      action.callback([]);
    }
  }

  export function* getCategoriesRequest(action) {
    try {
      const response = yield call(services.getCategories, action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert(JSON.stringify(e));
      action.callback([]);
    }
  }

  export function* getPopularBlogsRequest(action) {
    try {
      const response = yield call(services.getPopularBlogs, action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert(JSON.stringify(e));
      action.callback([]);
    }
  }

  export function* getHeaderBlogRequest(action) {
    try {
      const response = yield call(services.getHeaderBlog, action.payload);
      const { statusCode, message, data = [] } = response?.data || {};
      if (statusCode === 200) {
        action.callback(data);
      } else {
        errorAlert(message);
        action.callback([]);
      }
    } catch (e) {
      errorAlert(JSON.stringify(e));
      action.callback([]);
    }
  }