// API
import * as HttpApi from '../../Lib/Api/index';




//////////////////
///// GET ////////
//////////////////

export const getCartList = (params) => {
    return HttpApi.get('GET_CART_LIST', params)
        .then((response) => {
            console.log('getCartList api');
            console.log(response);
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};



//////////////////
///// POST ////////
//////////////////
export const createCartList = (params) => {
    return HttpApi.post('POST_CREATE_CART', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteCartList = (params) => {
    return HttpApi.post('POST_DELETE_CART', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};