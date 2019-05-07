"use strict";


const _ = require("underscore");


function makeFormat(code, data) { 

    if(module.exports.CODE_FORMAT(code)) {
        code.data = data;
        return code;
    }
    else {
        if(_.isUndefined(data)) {
            data = code;
        }
        return { code : 200, data : data };
    }
}

module.exports.DATA            = makeFormat;
module.exports.CODE_FORMAT     = function(value) { if(!value) { return false; } return value.hasOwnProperty("code"); };
module.exports.OK              = module.exports.DATA(undefined);


module.exports.DB_CLOSE_ERROR     = { code : 401, message : "종료 시, 에러 발생." };
module.exports.DB_PARAM_ERROR     = { code : 402, message : "저장 프로시저 파라미터 에러." };
module.exports.DB_CALL_ERROR      = { code : 403, message : "저장 프로시저 호출 에러." };
module.exports.DB_CONN_ERROR      = { code : 404, message : "디비 커넥션 에러." };
module.exports.DB_CALL_FAIL       = { code : 405, message : "저장 프로시저 에러 반환." };
module.exports.DB_UNKOWN_ERROR    = { code : 406, message : "알 수 없는 디비 에러." };

module.exports.ALREADY_REG        = { code : 407, message : "계정이 이미 등록 됨." };
module.exports.NO_DATA            = { code : 408, message : "해당 데이터 없음." };
module.exports.WRONG_PASSWORD     = { code : 409, message : "잘못된 비밀번호입니다." };
module.exports.INVALID_BODY_DATA  = { code : 410, message : "잘못된 바디 데이터 입니다." };
module.exports.INVALID_QUERY_DATA = { code : 411, message : "잘못된 쿼리 데이터 입니다." };
module.exports.NOT_AUTHENTICATED  = { code : 412, message : "인증된 사용자가 아닙니다." };
module.exports.INVALID_TOKEN      = { code : 413, message : "유효하지 않은 토큰입니다." };
module.exports.FAIL_SOCIAL_LOGIN  = { code : 414, message : "소셜로그인 실패." };
module.exports.INVALID_PARAM_DATA = { code : 415, message : "잘못된 파라미터 데이터 입니다." };
module.exports.RESOURCE_NOT_FOUND = { code : 416, message : "파일이 없습니다." };
module.exports.NO_COIN_VALUES     = { code : 417, message : "일치하는 코인 값이 없습니다." };
module.exports.INVALID_TYPE       = { code : 418, message : "일치하는 타입이 없습니." };
module.exports.PAYMENT_NO_CUSTOMDATA = { code : 419, message : "결제 완료에 필요한 데이터가 없습니다." };
module.exports.PAYMENT_NO_MATCH_ID   = { code : 420, description : "결제 정보가 일치하지 않습니다." };
module.exports.PAYMENT_INFO_ERROR    = { code : 421, description : "결제 정보를 가져오는데 실패했습니다." };
module.exports.PAYMENT_INVENTORY_ERROR    = { code : 422, description : "재고수량이 부족합니다." };


module.exports.NORMAL_TYPE = 0;
module.exports.FUNDING_TYPE = 1;
module.exports.VIDEO_TYPE = 2;

module.exports.CURRENCY_COIN = "coin";
module.exports.CURRENCY_KRW = "krw";
module.exports.CURRENCY_MILE = "mile";

