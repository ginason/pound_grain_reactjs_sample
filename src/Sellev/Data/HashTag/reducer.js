import * as ActionTypes from './actionTypes';

export const initialState = {
    author: {
        type: null,
    },
}
/*
*/
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return Object.assign({}, state, { author: action.author });
        case ActionTypes.LOGOUT:
            return Object.assign({}, state, { author: initialState.author });
        default:
            return state;
    }
}
