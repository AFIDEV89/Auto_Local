import { GET_VEHICLE_TYPE_LIST, GET_VEHICLE_DETAIL_LIST_REQUEST } from "../action-types";

export const getVehicleTypeListRequest = (callback) => ({
  type: GET_VEHICLE_TYPE_LIST.REQUEST,
  callback
});

export const getVehicleTypeListSuccess = (payload) => ({
  type: GET_VEHICLE_TYPE_LIST.SUCCESS,
  payload
});

export const getVehicleDetailRequest = (callback) => ({
  type: GET_VEHICLE_DETAIL_LIST_REQUEST,
  callback
});

