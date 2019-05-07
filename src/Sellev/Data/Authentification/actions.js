/**
 * @providesModule ActionAuth
 */
import * as ActionTypes from './actionTypes';
import * as ActionAuth from './actions';
import * as Const from './const';
import Store from '../../store';

// API
import * as HttpApi from '../../Lib/Api/index';

/*
* other constants
*/
export const actionTypes = ActionTypes;
export const LOGIN_WARNING_MESSAGE = Const.LOGIN_WARNING_MESSAGE;
export const USER_NOT_EXIST_MESSAGE = Const.USER_NOT_EXIST_MESSAGE;
/*
* action creators
*/

//////////////////
///// GET ////////
//////////////////

/*
*/
export const session = () => {
    return (dispatch) => {
        return HttpApi.get('GET_AUTH_SESSION')
            .then((response) => {
                dispatch({ type: ActionTypes.LOGIN, author: response.data });
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

//////////////////
///// POST ///////
//////////////////
/*
* @params {String} query.phoneNumber
* @params {String} query.password
*/
export const login = (params) => {
    return (dispatch) => {
        return HttpApi.post('POST_AUTH_LOGIN', params)
            .then((response) => {
                dispatch({ type: ActionTypes.LOGIN, author: response.data });
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
/*
* @params {String} params.idText
* @params {String} params.password
* @params {Number} params.countryDialCode
* @params {Number} params.phoneNumber
* @params {String} params.name
* @params {String} params.email
* @params {String} params.state // 주소에서 시(광역), 도 ex)서울시 / 경기도 / 강원도
* @params {String} params.city // 주소에서 구(광역), 시 / 군 ex) 서초구 / 성남시 / 횡성군
* @params {String} params.address1  // 주소에서 동(광역) / 구 / 읍 ex) 서초동 / 분당구 / 횡성읍
* @params {String} params.address2 // 자세한 주소
*/
//http://www.juso.go.kr/support/AddressMainSearch.do?searchType=TOTAL => 주소검색기
export const signup = (params) => {
    return (dispatch) => {
        return HttpApi.post('POST_AUTH_SIGNUP', params)
            .then((response) => {
                dispatch({ type: ActionTypes.LOGIN, author: response.data });
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

/*
* @params {Integer} query.countryCode
* @params {String} query.phoneNumber
*/
export const isExist = ( params ) => {
    return HttpApi.post('POST_AUTH_IS_EXIST', params)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const logout = () => {
    return (dispatch) => {
        return HttpApi.post('POST_AUTH_LOGOUT')
            .then((response) => {
                dispatch({ type: ActionTypes.LOGOUT });
                return Promise.resolve();
            })
            .catch((err) => {
                dispatch({ type: ActionTypes.LOGOUT });
                return Promise.resolve();
            });
    };
};
/*
* @params {Number} query.countryCode
* @params {string} query.phoneNumber
* @params {boolean} query.isForced
*/
export const postVerificationCode = (params) => {
    return HttpApi.post('POST_AUTH_VERIFY_PHONENUMBER', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
/*
* @params {String} query.idText
* @params {String} query.countryDialCode
* @params {String} query.phoneNumber
* or
* @params {String} query.currentPassword
* and
* @params {String} query.password
*/
export const changePassword = ( params ) => {
    return HttpApi.post('POST_AUTH_CHANGE_PASSWORD', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
/*
* @params {String} query.countryDialCode
* @params {String} query.phoneNumber
* @params {String} query.oldPassword
* @params {String} query.newPassword
*/
export const changePasswordByPhoneNumber = ( params ) => {
    return HttpApi.post('POST_AUTH_CHANGE_PASSWORD_BYPHONENUMBER', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};


/*
* @params {String} query.countryDialCode
* @params {String} query.phoneNumber
*/
export const findIdText = ( params ) => {
    return HttpApi.post('POST_AUTH_VERIFY_PHONENUMBER', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {String} query.countryCode
* @params {String} query.phoneNumber
* @params {String} query.name
* @params {String} query.profileUrl
* @params {String} query.coverUrl
* @params {Number} query.type
*/
export const updateProfile = ( params ) => {
    return HttpApi.post('POST_UPDATE_PROFILE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {String} query.email
* @params {String} query.countryCode
* @params {String} query.phoneNumber
 */
export const existence = ( params ) => {
    return HttpApi.post('POST_AUTH_SIGNUP_EXISTENCE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {String} query.password
 */
export const verifyPassword = ( params ) => {
    return HttpApi.post('POST_AUTH_VERIFY_PASSWORD', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

//////////////////
///// DELETE ///////
//////////////////
export const deleteAccount = () => {
    return (dispatch) => {
        return HttpApi.del('GET_AUTH_SESSION')
            .then((response) => {
                dispatch({ type: ActionTypes.LOGOUT });
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

//////////////////
/// FUNCTIONS ////
//////////////////
export const initializeFacebook = () => {
    
};