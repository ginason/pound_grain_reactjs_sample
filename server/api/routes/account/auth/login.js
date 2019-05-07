"use strict";


const express  = require("express");
const router   = express.Router();
const geoip    = require("geoip-lite");
const middle   = require("../../middle");
const utils    = require("../../../utils");
const system   = require("../../../../../system");
const database = require("../../../database");
module.exports = router;


const E = system.E;
const C = system.C;


/*
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/login /
 *  @apiName post-account-auth-login
 *  @apiGroup Account>auth
 *  @apiDescription 로그인
 *  @apiParam {integer}  countryCode   [body] 국가코드(id)
 *  @apiParam {string}   phoneNumber   [body] 휴대폰번호(id)
 *  @apiParam {string}   password      [body] 비밀번호 ( OR SNS 토큰 )
 *  @apiParam {integer}  stype         [body] 소셜 계정 타입 ( NULL(default), SNS 타입, F(facebook), N(naver), K*kakao) )
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      user : {
 *          userId      : "integer",
 *          countryCode : "integer",
 *          phoneNumber : "string",
 *          name        : "string",
 *          profileUrl  : "string",
 *          coverurl    : "string",
 *          type        : "integer",
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }
 *  }
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 408, description : "계정이 존재하지 않음" }
 *  { code : 409, description : "잘못된 비밀번호입니다." }
 *  { code : 406, description : "알 수 없는 디비 에러." }
 *  { code : 412, description : "알 수 없는 디비 에러." }
 */
 
router.post("/", middle.sns, function(req, res, next) {
    console.log(req.body);
    utils.auth(req, res, next, (err, user) => {
        console.log('= SESSION =');
        console.log(err);
        console.log(user);
        system.debug(req.body);
        if (err) { return res.json(err.value); }
        return res.json(C.DATA({ user : user }));
    });
});

