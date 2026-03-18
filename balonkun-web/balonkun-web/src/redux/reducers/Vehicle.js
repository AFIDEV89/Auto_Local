import { GET_VEHICLE_TYPE_LIST } from "@redux/action-types";

const initialState = [];

const vehicleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VEHICLE_TYPE_LIST.SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export default vehicleReducer;
