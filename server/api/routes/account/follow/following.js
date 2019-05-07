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
 *  @api {GET} /account/follow/followings/:userId /follow/:userId
 *  @apiName get-account-auth-follow-followings
 *  @apiGroup Account>follow
 *  @apiDescription 팔로잉하는 사용자 목록 불러오기

 *  @apiParam {integer}  userId       [params] 팔로잉 목록을 받아올 사용자Id
 *  @apiParam {integer}   [from=0]    [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]  [query] 특정 개수만큼 불러온다

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      users : [{
 *          userId      : "integer",
 *          countryCode : "integer",
 *          phoneNumber : "string",
 *          name        : "string",
 *          profileUrl  : "string",
 *          coverUrl    : "string",
 *          type        : "integer",
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }, ...]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/:userId", function(req, res, next) {

    const userId = parseInt(req.params.userId, 10);
    const from   = system.ensure(parseInt(req.query.from, 10), 0);
    const count  = system.ensure(parseInt(req.query.count, 10) , 20);

    if(isNaN(userId)) { return res.json(C.INVALID_PARAM_DATA); }
    database.getFollowings(userId, from, count, (err, users) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ users : users }));
    });      
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/follow/followings /follow
 *  @apiName post-account-auth-followings
 *  @apiGroup Account>follow
 *  @apiDescription 팔로우 하기

 *  @apiParam {integer}  userIdTo     [body] 팔로우 할 사용자 Id
 *  @apiParam {boolean}  following    [body] 팔로우 플래그 ( true, false )
 *  @apiParam {integer}   [from=0]    [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]  [query] 특정 개수만큼 불러온다


 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      success: "boolean"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/", middle.isLogin, function(req, res, next) {
    
    const user = req.user;
    const userIdFrom = user.userId;
    const userIdTo   = parseInt(req.body.userIdTo, 10);
    const following  = system.boolean(req.body.following);

    if(isNaN(userIdTo)) { return res.json(C.INVALID_BODY_DATA); }
    database.setFollowing(userIdFrom, userIdTo, following, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ success : true }));
    });
});
