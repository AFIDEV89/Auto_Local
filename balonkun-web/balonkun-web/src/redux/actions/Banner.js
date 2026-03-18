import { GET_BANNER_LIST_REQUEST } from "@redux/action-types";

export const getBannerListRequest = (callback) => ({
  type: GET_BANNER_LIST_REQUEST,
  callback
})