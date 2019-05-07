/**
 * @providesModule ActionAuth
 */
// API
import * as HttpApi from '../../Lib/Api/index';

/*
* other constants
*/

/*
* action creators
*/

//////////////////
///// GET ////////
//////////////////
export const getUserCount = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_USER_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};
/*
* @params {Integer} query.count
* @params {String} query.searchQuery
* @params {Integer} query.userId
*/
export const getUserList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_USER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

/*
* @params {Integer} query.count
* @params {String} query.searchQuery
* @params {Integer} query.userId
*/
export const getUserPriority = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_USER_PRIORITY', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};
export const getUserPriorityCount = (params) => {
    console.log('console.log(params);');
    console.log(params);
    return (dispatch) => {
        return HttpApi.get('GET_USER_PRIORITY_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

/*
* @params {Integer} query.userId
*/
export const getFollowerList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_FOLLOWER_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

/*
* @params {Integer} query.count
* @params {String} query.searchQuery
* @params {Integer} query.userId
*/
export const getFollowingList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_FOLLOWING_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

//////////////////
///// POST ////////
//////////////////

/*
* @params {Integer} query.count
*/
export const followUser = (params) => {
    return HttpApi.post('POST_FOLLOW_USER', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};