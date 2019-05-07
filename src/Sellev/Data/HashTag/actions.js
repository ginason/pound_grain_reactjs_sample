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
/*
* 해쉬테그 홈에서 테스트
* */
export const getHashTagCount = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_HASHTAG_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};
/*
* @params {Number} query.countryDialCode
*/
export const getHashTagList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_HASHTAG_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

export const getHashTagOne = (params) => {
    return HttpApi.get('GET_HASHTAG_ONE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};


//////////////////
///// POST ///////
//////////////////
/*
* @params {String} query.idText (idText 혹은 fullPhoneNumber 둘 중 하나는 필수)
* @params {String} query.password
*/
export const hashTagLike = (params) => {
    return HttpApi.post('POST_HASHTAG_LIKE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {String} query.hashtagId
*/
export const increaseHit = (params) => {
    return HttpApi.post('POST_HASHTAG_INCREASE_HIT', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

