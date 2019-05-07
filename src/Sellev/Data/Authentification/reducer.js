import * as ActionTypes from './actionTypes';

export const initialState = {
    author: {
    },
    isWebview: false,
}
/*
*/
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return Object.assign({}, state, { author: action.author.data });
        case ActionTypes.LOGOUT:
            return Object.assign({}, state, { author: initialState.author });
        case ActionTypes.IS_WEBVIEW:
            if (state.isWebview) {
                return state;
            } else {
                return Object.assign({}, state, { isWebview: action.isWebview });
            }
        default:
            return state;
    }
}
