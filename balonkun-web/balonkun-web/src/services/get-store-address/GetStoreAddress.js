import config from './Config';
import { getDataApi } from '../ApiCaller';

export const getStoreAddressRequest = () => {
  const request = config.getStoreAddressRequest;
  return getDataApi(request);
};

