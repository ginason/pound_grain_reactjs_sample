// API
import * as HttpApi from '../../Lib/Api/index';

/*
* other constants
*/
import * as Const from './const';
import * as CoinPrice from './coinPrice';
export const FUNDING_PAYMENT_METHOD_ARRAY = Const.FUNDING_PAYMENT_METHOD_ARRAY;
export const MARKET_PAYMENT_METHOD_ARRAY = Const.MARKET_PAYMENT_METHOD_ARRAY;
export const TAB_CONTENTS = Const.TAB_CONTENTS;
export const PAYMENT_STATE = Const.PAYMENT_STATE;
export const coinPrice = CoinPrice.coinPrice;

//////////////////
///// GET ////////
//////////////////
/*
 *  @apiParam {integer}   from=0        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   count=20      [query] 특정 개수만큼 불러온다
 *  @apiParam {integer}   [invoiceId]   [query] 특정 청구 Id
 *  @apiParam {integer}   [paymentId]   [query] 특정 결제 Id
 *  @apiParam {integer}   [userId]      [query] 특정 고객 Id
 *  @apiParam {string}    [searchQuery] [query] 검색 쿼리 (customerId, invoiceId 으로 검색)
 *  @apiParam {date}      [dateFrom]    [query] 시작 날짜
 *  @apiParam {date}      [dateTo]      [query] 종료 날짜
 *  @apiParam {integer}   [state]       [query] 현 상태
 */
export const getInvoiceList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_INVOICE_LIST', params)
            .then((response) => {
                console.log(response);
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

export const getOrderList = (params) => {
    return (dispatch) => {
        return HttpApi.get('GET_ORDER_LIST', params)
            .then((response) => {
                console.log('GET_ORDER_LIST');
                console.log(response);
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

/*
 *  @apiParam {integer}   from=0        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   count=20      [query] 특정 개수만큼 불러온다
 *  @apiParam {integer}   [invoiceId]   [query] 특정 청구 Id
 *  @apiParam {integer}   [paymentId]   [query] 특정 결제 Id
 *  @apiParam {integer}   [userId]      [query] 특정 고객 Id
 *  @apiParam {string}    [searchQuery] [query] 검색 쿼리 (customerId, invoiceId 으로 검색)
 *  @apiParam {date}      [dateFrom]    [query] 시작 날짜
 *  @apiParam {date}      [dateTo]      [query] 종료 날짜
* */
export const getInvoiceCount = (params) => {
    return HttpApi.get('GET_INVOICE_COUNT', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

/*
* */
export const getDeliveryDefault = (params) => {
    return HttpApi.get('GET_DELIVERY_DEFAULT', params)
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
 *  @apiParam {string}    currency   [body] 통화 (krw / coin / mile)
 *  @apiParam {integer}   [type]       [body] 0=일반상품(마켓), 1=펀딩, 2=동영상
 *  @apiParam {integer}   [coin]       [body] 구매하는 코인 개수
 *  @apiParam {array}     [option]      [body] 구매하려는 옵션의 array. 만약 코인을 구매하는 결제라면 option값이 없을 수 있다.
 *  @apiParam {integer}   option[].optionId     [body] optionId
 *  @apiParam {integer}   option[].quantity     [body] 구매하는 개수
* */
export const createInvoice = (params) => {
    return HttpApi.post('POST_CREATE_INVOICE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
/*
 *  @apiParam {integer}   [deliveryId]      [body] UPDATE 혹은 DELETE를 하려면 deliveryId가 필수
 *  @apiParam {string}    [name]            [body] 배송받는 사람 이름
 *  @apiParam {string}    [address]         [body] 배송받는 주소
 *  @apiParam {string}    [phoneNumber]     [body] 배송받는 사람 휴대폰번호
 *  @apiParam {boolean}   [isPrimary]       [body] 기본배송지 여부
* */
export const updateDelivery = (params) => {
    return HttpApi.post('POST_DELIVERY_UPDATE', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const cancelOrder = (params) => {
    return HttpApi.post('POST_ORDER_CANCEL', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};