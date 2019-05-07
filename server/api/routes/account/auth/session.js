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
 *  @api {GET} /account/auth/session /session
 *  @apiName get-account-auth-session
 *  @apiGroup Account>auth
 *  @apiDescription 세션

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
 *          type        : "integer",
 *          coin        : "integer",
 *          mileage     : "integer",
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/", middle.isLogin, function(req, res, next) {
    
    database.session(req.user.userId, (err, user) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ user : user }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/auth/session/logout /session/logout
 *  @apiName get-account-auth-session-logout
 *  @apiGroup Account>session
 *  @apiDescription 세션 로그아웃

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/logout", middle.isLogin, function(req, res, next) {

    req.logout();
    res.clearCookie("accessToken");
    return res.json(C.OK);
});


/**
 *  @apiVersion 0.0.1
 *  @api {DELETE} /account/auth/session /session
 *  @apiName delete-account-auth-session
 *  @apiGroup Account>session
 *  @apiDescription 계정 삭제

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.delete("/", middle.isLogin, function(req, res, next) {

    const user = req.user;
    database.deleteAccount(user.userId, (err) => {
        
        if(err) { return res.json(err.value); }
        req.logout();
        res.clearCookie("accessToken");
        return res.json(C.OK);        
    });
});
