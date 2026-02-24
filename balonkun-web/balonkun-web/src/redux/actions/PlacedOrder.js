import { PLACED_ORDER_CREATE } from "@redux/action-types";

export const placedOrderCreate = (payload, callback) => ({
  type: PLACED_ORDER_CREATE,
  payload,
  callback
});