"use strict";


const express  = require("express");
const router   = express.Router();
const middle   = require("../../middle");
const utils    = require("../../../utils");
const system   = require("../../../../../system");
const database = require("../../../database");
module.exports = router;


const E = system.E;
const C = system.C;


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/verification/phoneNumber /phoneNumber
 *  @apiName post-account-auth-verification-phoneNumber
 *  @apiGroup Account>auth
 *  @apiDescription 휴대폰 인증번호 받기

 *  @apiParam {integer}  countryCode   [body] 국가코드(id)
 *  @apiParam {string}   phoneNumber   [body] 휴대폰번호(id)
 *  @apiParam {boolean}  isForced      해당 휴대폰으로 회원가입이 되어있더라도, 무조건 인증번호를 보낸다. (휴대폰 인증을 통한 비밀번호 변경 등에서 사용)

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      verificationCode: "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/phoneNumber", function(req, res, next) {

    const countryCode = system.ensureNull(req.body.countryCode);
    const phoneNumber = system.ensureNull(req.body.phoneNumber);
    const isForced = system.boolean(req.body.isForced);

    if(!countryCode || !phoneNumber) { return res.json(C.INVALID_BODY_DATA); }

    database.verificationContact(countryCode, phoneNumber, isForced, (err, value) => {
        if (err) { return res.json(err.value); }
        res.json(C.DATA({ verificationCode : value }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/verification/password /password
 *  @apiName post-account-auth-verification-password
 *  @apiGroup Account>auth
 *  @apiDescription 휴대폰 인증번호 받기, 로그인 세션 있어야 함.

 *  @apiParam {string}   password   [body] 비밀번호
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/password", middle.isLogin, function(req, res, next) {

    const user = req.user;
    const password = system.ensureNull(req.body.password);
    if(!password) { return res.json(C.INVALID_BODY_DATA); }

    database.verificationPassword(user.userId, password, (err, value) => {
        if (err) { return res.json(err.value); }
        res.json(C.OK);
    });
});
