import config from './Config';
import { getDataApi, postDataApi, deleteDataApi, putDataApi } from '../ApiCaller';

export const cartProductCreate = (pid) => {
  const request = config.cartProductCreate;
  return postDataApi({
    path: request.path,
    data: {
      product_id: pid,
    },
  });
};

export const cartProductDelete = (pid) => {
  const { path } = config.cartProductDelete;
  return deleteDataApi({ path: path(pid) });
};

export const cartProductUpdate = (countData) => {
  const { path } = config.cartProductUpdate;
  return putDataApi({
    path: path(countData.pid), data: {
      operationType: countData.operationType
    }
  });
};

export const getCartProductList = () => {
  const request = config.getCartProductList;
  return getDataApi(request);
};

export const getCartProductCount = () => {
  const request = config.getCartProductCount;
  return getDataApi(request);
};
