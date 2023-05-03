// src/redux/store.js

import { createStore, combineReducers } from 'redux';
import restaurantReducer from './reducers/restaurantReducer';

const rootReducer = combineReducers({
    restaurant: restaurantReducer,
});

const store = createStore(
    rootReducer
);

export default store;
