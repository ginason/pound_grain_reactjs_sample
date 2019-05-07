"use strict";


const express  = require("express");
const router   = express.Router();
const async    = require("async");
const middle   = require("../../middle");
const utils    = require("../../../utils");
const system   = require("../../../../../system");
const database = require("../../../database");
module.exports = router;


const E = system.E;
const C = system.C;


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/setting/update /update
 *  @apiName post-account-auth-setting-update
 *  @apiGroup Account>auth
 *  @apiDescription 회원정보 업데이트. countryCode, phoneNumber

 *  @apiParam {integer}  countryCode   [body] 국가코드
 *  @apiParam {string}   phoneNumber   [body] 휴대폰번호
 *  @apiParam {string}   name          [body] 이름(닉네임)
 *  @apiParam {integer}  type          [body] 계정 타입
 *  @apiParam {strinbg}  memo          [body] 메모
 

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      user : {
 *          userId      : "integer",
 *          countryCode : "integer",
 *          phoneNumber : "string",
 *          name        : "string",
 *          type        : "integer",
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", middle.isLogin, function(req, res, next) {

    const user      = req.user;
    let countryCode = system.ensureNull(req.body.countryCode);
    let phoneNumber = system.ensureNull(req.body.phoneNumber);
    let name        = system.ensureNull(req.body.name);
    let memo        = system.ensureNull(req.body.memo, null);
    const profile   = req.body.profileUrl;
    const cover     = req.body.coverUrl;
    let type        = parseInt(req.body.type, 10);

    if(isNaN(type)) { type = user.type; }
    if(!name) { name = user.name; }
    if(!countryCode) { countryCode = user.countryCode; }
    if(!phoneNumber) { phoneNumber = user.phoneNumber; }

    database.updateAccount(user.userId, countryCode, phoneNumber, name, type, profile, cover, memo, (err) => {

        if (err) { return res.json(err.value); }
        user.name        = name;
        user.countryCode = countryCode;
        user.phoneNumber = phoneNumber;
        user.type        = type;
        user.updatedAt   = new Date();
        res.json(C.DATA({ user : user }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/setting/token /token
 *  @apiName post-account-auth-setting-token
 *  @apiGroup Account>auth
 *  @apiDescription 토큰 업데이트

 *  @apiParam {string}  [androidToken]   [body] 안드로이드 토큰
 *  @apiParam {string}   [iosToken]       [body] iOS 토큰

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      // 리턴값 없음
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/token", middle.isLogin, function(req, res, next) {

    const user      = req.user;
    let androidToken = req.body.androidToken || null;
    let iosToken = req.body.iosToken || null;

    database.updateToken(user.userId, androidToken, iosToken, (err) => {
        if (err) { return res.json(err.value); }
        res.json(C.DATA(null));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/setting/changepassword/byOldPassword /changepassword/byOldPassword
 *  @apiName post-account-auth-setting-change-password-by-old-password
 *  @apiGroup Account>auth
 *  @apiDescription 비밀번호 변경

 *  @apiParam {string}   phoneNumber   [body] 전화번호
 *  @apiParam {string}   countryCode   [body] 국가번호
 *  @apiParam {string}   oldPassword   [body] 기존 비밀번호
 *  @apiParam {string}   newPassword   [body] 신규 비밀번호

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      success: "boolean" // 만약 oldPassword가 틀리다면 false
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/changepassword/byOldPassword", function(req, res, next) {

    const user        = req.user;
    const phoneNumber = system.ensureNull(req.body.phoneNumber, null);
    const countryCode  = system.ensureNull(req.body.countryCode, null);
    const oldPassword = system.ensureNull(req.body.oldPassword);
    const newPassword = system.ensureNull(req.body.newPassword);

    database.changePassword(countryCode, phoneNumber, oldPassword, newPassword, (err) => {    
        if(err) { return res.json(err.value); }
        res.json(C.OK);
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/setting/changepassword/byPhoneNumberVerification /changepassword/byPhoneNumberVerification
 *  @apiName post-account-auth-setting-change-password-by-phone-number-verification
 *  @apiGroup Account>auth
 *  @apiDescription 비밀번호 변경

 *  @apiParam {integer}  countryCode   [body] 국가번호
 *  @apiParam {integer}  phoneNumber   [body] 핸드폰번호
 *  @apiParam {string}   newPassword   [body] 신규 비밀번호

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/changepassword/byPhoneNumberVerification", function(req, res, next) {
    console.log(req.body);
    const user         = req.user;
    const countryCode  = system.ensureNull(req.body.countryCode);
    const phoneNumber  = system.ensureNull(req.body.phoneNumber);
    const newPassword  = system.ensureNull(req.body.newPassword);

    if(!countryCode || !phoneNumber || !newPassword) { return res.json(C.INVALID_BODY_DATA); }

    database.changePasswordWithVrification(countryCode, phoneNumber, newPassword, 
        (err, value) => {
            if (err) { return res.json(err.value); }
            res.json(C.OK);
    });
});

