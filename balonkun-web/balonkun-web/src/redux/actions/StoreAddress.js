import { GET_STORE_ADDRESS_REQUEST } from "../action-types";

export const getStoreAddressRequest = (callback) => ({
  type: GET_STORE_ADDRESS_REQUEST,
  callback
});
