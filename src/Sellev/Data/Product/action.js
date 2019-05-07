// API
import * as HttpApi from '../../Lib/Api/index';
import * as ActionTypes from "./actionTypes";

/*
* other constants
*/
import * as Category from './category';
export const categoryId2Name = Category.categoryId2Name;




//////////////////
///// GET ////////
//////////////////

/*
* @params {String} query.idText
*/

/*
* @params {Integer} query.from
* @params {Integer} query.count
* @params {Boolean} query.isLike (optional)
* @params {String} query.sort
* @params {Boolean} query.isNormal (optional)
* @params {Boolean} query.isFunding (optional)
* @params {Boolean} query.isVideo (optional)
* @params {Integer} query.category (optional)
* @params {Boolean} query.includeDeleted (optional)
*/
export const getProductList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_PRODUCT_LIST', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
/*
* @params {Boolean} query.isLike (optional)
* @params {Boolean} query.isNormal (optional)
* @params {Boolean} query.isFunding (optional)
* @params {Boolean} query.isVideo (optional)
* @params {Integer} query.category (optional)
* @params {Boolean} query.includeDeleted (optional)
*/
export const getProductListCount = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_PRODUCT_COUNT', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};

/*
* @params {Integer} params.productId
*/
export const getProductOne = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_PRODUCT_ONE', params)
            .then((response) => {
                console.log(response.data);
                dispatch({ type: ActionTypes.CURRENT_PRODUCT, product: response.data.data });
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
export const productLike = (params) => {
    return (dispatch) => {
        return HttpApi.post('POST_PRODUCT_LIKE', params)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };
};
/*
* @params {Integer} query.productId
*/
export const increaseHit = (params) => {
    return HttpApi.post('POST_PRODUCT_INCREASE_HIT', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

