import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from "redux-saga";

import rootReducer from '../reducers';
import rootSaga from '../saga';

const persistConfig = {
  debug: false,
  key: 'root',
  keyPrefix: 'v.1',
  storage
};

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create a redux store with our reducer above and middleware
var store = createStore(
  persistedReducer,
  compose(applyMiddleware(sagaMiddleware))
);

var persistor = persistStore(store);

// run the saga
sagaMiddleware.run(rootSaga);

export { store, persistor };
