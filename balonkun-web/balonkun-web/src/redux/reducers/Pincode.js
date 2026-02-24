import { SET_PINCODE } from "@redux/action-types";

const initialState = {
    pincode: 0
};

const pincodeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PINCODE:
            return { ...state, pincode: Number(action.payload.locationPinCode) };

        default:
            return state;
    }
};

export default pincodeReducer;
