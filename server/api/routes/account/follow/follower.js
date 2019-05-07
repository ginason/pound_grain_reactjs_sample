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
 *  @api {GET} /account/follow/followers/:userId /follow/:userId
 *  @apiName get-account-auth-follow-followers
 *  @apiGroup Account>follow
 *  @apiDescription 팔로워 목록 불러오기

 *  @apiParam {integer}  userId   [params] 팔로워 목록을 받아올 사용자 Id 
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
    database.getFollowers(userId, from, count, (err, users) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ users : users }));
    });   
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /account/follow/followers/:userId/count /follow/:userId/count
 *  @apiName get-account-auth-follow-followers-count
 *  @apiGroup Account>follow
 *  @apiDescription 팔로워 갯수 가져오기

 *  @apiParam {integer}  userId   [params] 팔로워 갯수 받아올 사용자 Id 
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/:userId/count", middle.isLogin, function(req, res, next) {

    const userId = parseInt(req.params.userId, 10);
    if(isNaN(userId)) { return res.json(C.INVALID_PARAM_DATA); }

    database.getFollowersCount(userId, userId, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });   
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /account/follow/followers/isfollowed /follow/:userId/count/isfollowed
 *  @apiName get-account-auth-follow-followers-isfollowed
 *  @apiGroup Account>follow
 *  @apiDescription 팔로워 관계 확인 하기

 *  @apiParam {integer}  from   [query] 팔로워 한 사용자 아이디
 *  @apiParam {integer}  to   [query] 팔로워 당한 사용자 아이디
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      follow : "boolean"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/isfollowed", middle.isLogin, function(req, res, next) {

    const fromId = system.ensure(parseInt(req.query. from, 10), 0);
    const toId = system.ensure(parseInt(req.query. to, 10), 0);

    database.isFollowed(fromId, toId, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });   
});
