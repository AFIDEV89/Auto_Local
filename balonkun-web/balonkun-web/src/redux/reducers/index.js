import { combineReducers } from 'redux';

import userReducer from './User';
import cartReducer from './Cart';
import vehicleReducer from './Vehicle';
import pincodeReducer from './Pincode'

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  vehicle: vehicleReducer,
  pincode: pincodeReducer
});

export default rootReducer;
