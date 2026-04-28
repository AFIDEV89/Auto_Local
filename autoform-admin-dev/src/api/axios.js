import axios from "axios";

import { errorAlert } from 'views/helpers';
import { getCookie, removeToken } from 'views/helpers/storageHelpers';

import appConfig from "../AppConfig";

const customAxios = axios.create({
  baseURL: `${appConfig.REACT_APP_API_BASE_URL}/api/v1`,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

const requestHandler = (request) => {
  const accessToken = getCookie('accessToken');
  request.headers['Api-Key'] = process.env.REACT_APP_API_KEY;
  request.headers['user-type'] = process.env.REACT_APP_USER_TYPE
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  };
  return request;
};

const responseHandler = (response) => {
  if (response?.data?.statusCode === 401) {
    removeToken('token', '', 1);
    errorAlert(response?.data?.error);
    window.location.replace('/login');
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
