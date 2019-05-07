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
 *  @apiParam {integer}   [from=0]        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]      [query] 특정 개수만큼 불러온다
*/
export const getNotificationList = (params) => {
    return HttpApi.get('GET_NOTIFICATION_LIST', params)
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
 * @params {integer} query.notificationId
 * @params {integer} query.isChecked [body] 알람을 읽을 경우, true로 바꾸어주어야 함
 */
export const notificationUpdate = (params) => {
    return HttpApi.post('POST_NOTIFICATION_UPDATE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};