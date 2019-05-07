/**
 * @providesModule ActionAuth
 */
import Store from '../../store';

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

/*
* @params {Number} query.countryDialCode
*/
export const getBannerList = (params) => {
    return HttpApi.get('GET_BANNER_LIST', params)
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
