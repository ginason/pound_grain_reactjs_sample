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

//////////////////
///// POST ///////
//////////////////
/*
* @params {String} query.phoneNumber
* @params {String} query.password
*/
export const uploadImage = (file) => {
    return HttpApi.upload('UPLOAD_IMAGE', {
        file: file,
    }).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.upload('UPLOAD_IMAGE', {
            file: file,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
