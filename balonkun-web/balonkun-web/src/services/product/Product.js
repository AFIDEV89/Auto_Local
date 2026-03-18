import { filteredObj, getFilterString } from '@utils';
import { getDataApi, postDataApi, putDataApi } from '../ApiCaller';
import config from './Config';
import { errorAlert, successAlert } from '../../utils';

export const getProductList = (params) => {
  const request = config.getProductList;
  return postDataApi({
    path: request.path,
    data: filteredObj(params)
  });
};

export const getProduct = (pid) => {
  const { path } = config.getProduct;
  return getDataApi({ path: path(pid) });
};

export const getFilterList = () => {
  const request = config.getFilterList;
  return getDataApi({
    path: request.path
  });
};

export const getProductReviews = (payload) => {
  const request = config.getProductReviews;
  
  return getDataApi({
    path: request.path(payload.productId)
  });
};



export const getListingSEOData = (payload) => {
  const request = config.getListingSEO;

  const filterString = getFilterString(payload.selectedFilters);
  
  return getDataApi({
    path: request.path(filterString)
  });
}

export const getFooterSEOData = (payload) => {
  const request = config.getFooterSEO;
  
  return getDataApi({
    path: request.path
  });
}

export const addToWishList = async (product_id) => {
  try {
    const response = await putDataApi({
      path: `user/wishlist/${product_id}`
    });

    if (response?.data?.data && [204].includes(response?.data?.statusCode)) {
      successAlert(response?.data?.data.message)
    } else {
      errorAlert("Something went wrong while adding product to wishlist. Please try again later")
    }
  } catch (error) {
    errorAlert("Something went wrong while adding product to wishlist. Please try again later")
  }
}