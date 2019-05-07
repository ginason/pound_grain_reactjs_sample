import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducer as dataReducer } from './Data/reducer';

const appReducer = combineReducers({
    data: dataReducer,
});

const enhancer = compose(
    applyMiddleware(thunk),
);

let store;

store = createStore(
    appReducer,
    enhancer,
);
export default store;

export const newStore = createStore(
    appReducer,
    enhancer,
);

