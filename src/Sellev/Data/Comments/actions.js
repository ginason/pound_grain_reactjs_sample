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
* @params {Integer} query.productId (optional)
* @params {Integer} query.commentParentId (optional)
*/
export const commentList = ( params ) => {
    return HttpApi.get('GET_COMMENT_LIST', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {Integer} query.Id (optional)
*/
export const commentCount = ( params ) => {
    return HttpApi.get('GET_COMMENT_COUNT', params)
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
* @params {Integer} query.commentId
* @params {Integer} query.commentParentId
* @params {Integer} query.productId
* @params {String} query.comment
* @params {Boolean} query.isDeleted
*/
export const createComment = (params) => {
    return HttpApi.post('POST_COMMENT_UPDATE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* @params {Integer} params.commentId
* @params {Integer} query.delete
*/
export const commentLike = (params) => {
    return HttpApi.post('POST_COMMENT_LIKE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
