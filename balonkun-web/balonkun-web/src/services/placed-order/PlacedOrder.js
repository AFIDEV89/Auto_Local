import config from './Config';
import { postDataApi } from '../ApiCaller';

export const placedOrderCreate = ({ storeId, user_address_id }) => {
  const request = config.placedOrderCreate;
  return postDataApi({
    path: request.path,
    data: {
      store_id: storeId,
      ...(user_address_id && {
        user_address_id: user_address_id
      })
    },
  });
};