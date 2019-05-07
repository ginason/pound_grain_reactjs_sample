import { combineReducers } from 'redux';
import { authReducer } from './Authentification/reducer';
import { productReducer } from './Product/reducer';

export const reducer = combineReducers({
    auth: authReducer,
    productInfo: productReducer,
});
