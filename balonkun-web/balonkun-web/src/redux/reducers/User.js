import { USER_LOGIN, USER_LOGOUT, UPDATE_USER_PROFILE, UPDATE_PROFILE_DATA } from "@redux/action-types";

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  token: '',
  mobile_no: 0,
  isLogin: false,
  vehicleTypeId: 0,
  vehicleBrandId: 0,
  vehicleBrandModelId: 0,
  vehicleLocationId:0,
  is_phone_verified: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    /** set user detail */
    case USER_LOGIN.SUCCESS: {
      return {
        ...state,
        firstName: action.payload.first_name,
        lastName: action.payload.last_name,
        email: action.payload.email,
        token: action.payload.login_session_token,
        isLogin: true,
        vehicleTypeId: action.payload.vehicle_type_id,
        vehicleBrandId: action.payload.vehicle_brand_id,
        vehicleBrandModelId: action.payload.vehicle_brand_model_id,
        vehicleLocationId: action.payload.vehicle_location_id,
        mobile_no: action.payload.mobile_no,
        is_phone_verified: action.payload.is_phone_verified
      };
    }

    /** set user detail */
    case UPDATE_USER_PROFILE.SUCCESS: {
      const temp = { ...state };


      if (action.payload.first_name) {
        temp.firstName = action.payload.first_name;
      }
      if (action.payload.last_name) {
        temp.lastName = action.payload.last_name;
      }
      if (action.payload.vehicle_type_id > -1) {
        temp.vehicleTypeId = action.payload.vehicle_type_id;
      }
      if (action.payload.vehicle_brand_id > -1) {
        temp.vehicleBrandId = action.payload.vehicle_brand_id;
      }
      if (action.payload.vehicle_brand_model_id > -1) {
        temp.vehicleBrandModelId = action.payload.vehicle_brand_model_id;
      }
      if (action.payload.vehicle_location_id > -1) {
        temp.vehicleLocationId = action.payload.vehicle_location_id;
      }
      return temp;
    }

    case UPDATE_PROFILE_DATA : {
      return {
        ...state,
        firstName: action.payload.first_name,
        lastName: action.payload.last_name,
        mobile_no: action.payload.mobile_no,
        vehicleTypeId: action.payload.vehicle_type_id,
        is_phone_verified:  action.payload.is_phone_verified
      }
    }

    case USER_LOGOUT.SUCCESS:
      return Object.keys({}, initialState);

    default:
      return state;
  }
};

export default userReducer;
