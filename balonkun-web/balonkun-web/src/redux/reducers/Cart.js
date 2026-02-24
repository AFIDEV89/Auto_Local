import { USER_LOGOUT, GET_CART_PRODUCT_COUNT_SUCCESS, RESET_CART_PRODUCT_COUNT } from "@redux/action-types";

const initialState = {
  count: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_PRODUCT_COUNT_SUCCESS:
      return { ...state, count: action.payload };
    case USER_LOGOUT.SUCCESS:
      return initialState;
    case RESET_CART_PRODUCT_COUNT:
      return { ...state, count: 0 };

    default:
      return state;
  }
};

export default cartReducer;
