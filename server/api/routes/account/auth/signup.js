"use strict";


const express  = require("express");
const _        = require("underscore");
const async    = require("async");
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
 *  @api {POST} /account/auth/signup/existence /existence
 *  @apiName post-account-auth-signup-existence
 *  @apiGroup Account>auth
 *  @apiDescription 휴대폰번호 혹은 이메일로 이미 가입된 계정이 있는지 체크한다

 *  @apiParam {string}   email         [body] 이메일
 *  @apiParam {integer}  countryCode   [body] 국가코드
 *  @apiParam {string}   phoneNumber   [body] 휴대폰번호

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      isExist: "boolean"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/existence", function(req, res, next) {

    const countryCode = system.ensureNull(req.body.countryCode);
    const phoneNumber = system.ensureNull(req.body.phoneNumber);

    database.mobileExist(countryCode, phoneNumber, (err, value) => {
        return res.json(C.DATA(value));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/signup /
 *  @apiName post-account-auth-signup
 *  @apiGroup Account>auth
 *  @apiDescription 회원가입

 *  @apiParam {string}   email         [body] 이메일
 *  @apiParam {string}   password      [body] 비밀번호
 *  @apiParam {integer}  countryCode   [body] 국가코드
 *  @apiParam {string}   phoneNumber   [body] 휴대폰번호
 *  @apiParam {string}   profileUrl    [body] 프로필 이미지 경로
 *  @apiParam {string}   coverUrl      [body] 커버 이미지 경로
 *  @apiParam {string}   [memo]        [body] 셀레버일때만 필요함
 *  @apiParam {string}   name          [body] 이름(닉네임)
 *  @apiParam {integer}  type          [body] 계정 타입 0=일반사용자, 1=관리자, 2=셀레버
 *  @apiParam {integer}  stype         [body] 소셜 계정 타입 ( NULL(default), SNS 타입, F(facebook), N(naver), K*kakao) )
 *  @apiParam {array}    [hashtags]    [body] 해시태그 목록 ( hashtagId,hashtagId,hashtagId ',' 구분자로 된 문자열 )
 *  @apiParam {string}   [stoken]      [body] SNS 토큰
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      user : {
 *          userId      : "integer",
 *          countryCode : "integer",
 *          phoneNumber : "string",
 *          name        : "string",
 *          profileUrl  : "string",
 *          coverUrl    : "string",
 *          type        : "string",
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/", middle.sns, function(req, res, next) {

    const password    = req.body.password;
    const name        = req.body.name;
    const countryCode = req.body.countryCode;
    const phoneNumber = req.body.phoneNumber;
    const profile     = req.body.profileUrl;
    const cover       = req.body.coverUrl;
    const memo        = req.body.memo;
    let hashtags      = system.ensure(req.body.hashtags, null);
    let type          = parseInt(req.body.type, 10);
    let sid           = null;
    let stype         = null;
    let token         = null;

    if(isNaN(type) || !password) {
        return res.json(C.INVALID_BODY_DATA);
    }

    if(req.social) {
        if(req.social.err || !req.social.success) {
            return res.json(C.FAIL_SOCIAL_LOGIN);
        }

        stype = system.ensureNull(req.social.type);
        sid   = system.ensureNull(req.social.id);
        token = system.ensureNull(req.social.token);
    }

    async.waterfall([
        (callback) => {
            database.signup(type, password, name, countryCode, phoneNumber, profile, cover, stype, sid, token, (err, user) => {
                callback(err, user);
            });            
        },
        (user, callback) => {
            utils.auth(req, res, next, (err, session) => {
                callback(err, user);
            });
        }
    ],
    (err, user) => {
        if (err) { return res.json(err.value); }
        return res.json(C.DATA({ user : user }));
    });
});