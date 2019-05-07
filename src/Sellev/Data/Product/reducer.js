import * as ActionTypes from './actionTypes';

export const initialState = {
    product: {
    },
}
/*
*/
export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.CURRENT_PRODUCT:
            return Object.assign({}, state, { product: action.product.data });
        default:
            return state;
    }
}
