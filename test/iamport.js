
"use strict";


const async    = require("async");
const events   = require("events");
const _        = require("underscore");
const request  = require("request");


console.log(_.sortBy([1, 9, 7, 4, 5], item => {
  return item;
}));


// async.waterfall([
//   function(callback) {
//       const opt = {
//           url     : "https://api.iamport.kr/users/getToken",
//           method  : "post",
//           headers : { "Content-Type": "application/json" }, // "Content-Type": "application/json"
//           json    : true,
//           body    : {
//                 imp_key    : "0631772845341190",
//                 imp_secret : "vbZRQl7RWu0HggvKQTe21c61SgJ4yd24p2Vgn37kx71NoxyfrMhtZouREeWdrZhQ1c7pfeJMmLALi90K"
//             }
//       };
//       request(opt, function (error, response, body) {
//             callback(error, body);
//       });
//   },
//   function(body, callback) {
//     // console.log(body.response.now, body.response.expired_at, parseInt(+new Date()/1000, 10));
//         const opt = {
//           url     : "https://api.iamport.kr/subscribe/payments/again",
//           method  : "post",
//           headers : { "Authorization": body.response.access_token }, // 인증 토큰 Authorization header에 추가
//           json    : true,
//           body    : {
//             customer_uid : 95382678,
//             merchant_uid : 95382678123123123, // 새로 생성한 결제(재결제)용 주문 번호
//             amount       : 8900,
//             name         : "SDFSDFSDF"
//           }    
//         };
//         request(opt, function (error, response, body) {
//               callback(error, body);
//         });
//   }
// ], function(err, result) {
//   console.log("RESULT", err, result);
// })



// // RESULT null { code: 0,
// //   message: null,
// //   response:
// //    { amount: 8900,
// //      apply_num: '06261080',
// //      bank_code: null,
// //      bank_name: null,
// //      buyer_addr: null,
// //      buyer_email: null,
// //      buyer_name: null,
// //      buyer_postcode: null,
// //      buyer_tel: null,
// //      cancel_amount: 0,
// //      cancel_history: [],
// //      cancel_reason: null,
// //      cancel_receipt_urls: [],
// //      cancelled_at: 0,
// //      card_code: '374',
// //      card_name: '하나(구외환)',
// //      card_quota: 0,
// //      cash_receipt_issued: false,
// //      channel: 'api',
// //      currency: 'KRW',
// //      custom_data: null,
// //      escrow: false,
// //      fail_reason: null,
// //      failed_at: 0,
// //      imp_uid: 'imps_156288298043',
// //      merchant_uid: '95382678123123120',
// //      name: 'SDFSDFSDF',
// //      paid_at: 1524813288,
// //      pay_method: 'card',
// //      pg_provider: 'danal_tpay',
// //      pg_tid: '201804271614461095101400',
// //      receipt_url: 'https://www.danalpay.com/receipt/creditcard/view.aspx?dataType=receipt&cpid=9810030929&data=pstWkpO5vgRlUHZIH8kI7r409ITZDkfLLhoLcVyorm5CeVo5XO8lY3a8VnQ5Ee2F',
// //      status: 'paid',
// //      user_agent: 'sorry_not_supported_anymore',
// //      vbank_code: null,
// //      vbank_date: 0,
// //      vbank_holder: null,
// //      vbank_name: null,
// //      vbank_num: null } }