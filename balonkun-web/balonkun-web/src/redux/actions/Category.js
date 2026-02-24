import { GET_CATEGORY_LIST_REQUEST } from "@redux/action-types";

export const getCategoryListRequest = (callback) => ({
  type: GET_CATEGORY_LIST_REQUEST,
  callback
})