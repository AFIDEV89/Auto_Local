// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import menuReducer from './slices/menu';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    user: userReducer,
    menu: menuReducer
});

export default reducer;
