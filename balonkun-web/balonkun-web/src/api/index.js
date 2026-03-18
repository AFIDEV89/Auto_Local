import axios from "axios";

import { getLogoutSuccess } from '@redux/actions';
import { store } from '@redux/store';
import { errorAlert } from '@utils';

const customAxios = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
  // baseURL: `${"http://localhost:5000"}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    'Api-Key': process.env.REACT_APP_API_KEY,
    'user-type': process.env.REACT_APP_USER_TYPE,
  },
});

const requestHandler = (request) => {
  const accessToken = store?.getState().user.token;
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  };
  return request;
};

const responseHandler = (response) => {
  if (response?.data?.statusCode === 401) {
    store.dispatch(getLogoutSuccess());
    errorAlert('Your session has been expired.');
  }

  return response;
};

const errorHandler = (error) => {
  return Promise.reject(error);
};

// Step-3: Configure/make use of request & response interceptors from Axios
// Note: You can create one method say configureInterceptors, add below in that,
// export and call it in an init function of the application/page.
customAxios.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

customAxios.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

// Step-4: Export the newly created Axios instance to be used in different locations.
export default customAxios;
