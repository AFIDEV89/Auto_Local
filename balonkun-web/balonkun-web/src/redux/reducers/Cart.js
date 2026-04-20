import { USER_LOGOUT, GET_CART_PRODUCT_COUNT_SUCCESS, RESET_CART_PRODUCT_COUNT, GET_CART_PRODUCT_SUCCESS } from "@redux/action-types";

const initialState = {
  count: 0,
  items: []
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_PRODUCT_COUNT_SUCCESS:
      return { ...state, count: action.payload };
    case GET_CART_PRODUCT_SUCCESS:
      return { ...state, items: action.payload };
    case USER_LOGOUT.SUCCESS:
      return initialState;
    case RESET_CART_PRODUCT_COUNT:
      return { ...state, count: 0, items: [] };

    default:
      return state;
  }
};

export default cartReducer;
