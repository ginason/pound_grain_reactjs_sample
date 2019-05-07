"use strict";

  
const express  = require("express");
const _        = require("underscore");
const router   = express.Router();
const middle   = require("../middle");
const utils    = require("../../utils");
const system   = require("../../../../system");
const database = require("../../database");
module.exports = router;


const E = system.E;
const C = system.C;


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /hashtag/list /list
 *  @apiName get-hashtag-list
 *  @apiGroup hashtag
 *  @apiDescription 해시태그 목록 불러오기
 *  @apiPermission 없음

 *  @apiParam {integer}   from=0          [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   count=20        [query] 특정 개수만큼 불러온다
 *  @apiParam {string}    sortMethod="date"      [query] 정렬방법 (date / hit / like )
 *  @apiParam {string}    sort="desc"            [query] 정렬순서 ( desc / asc )
 *  @apiParam {string}    [searchQuery]   [query] 검색쿼리
 *  @apiParam {integer}   [hashtagId]     [query] 해당 해시태그와 관련있는 해시태그 불러오기
 *  @apiParam {boolean}   [isLike=false]  [query] 세션사용자가 좋아요한 게시물만 가져오기(세션없으면 무시)
 *  @apiParam {boolean}   [userId=0]      [query] 해시태그 목록 가져올 사용자

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      hashtags : [{
 *          hashtagId    : "integer",
 *          hashtag      : "string",
 *          imageUrl     : "string",
 *          likeAmount   : "integer",
 *          isLike       : "boolean",
 *          updatedAt    : "date",
 *      }, ... ]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list", function(req, res, next) {

    const userId     = req.user ? req.user.userId : 0;
    const suserId    = system.ensure(parseInt(req.query.userId, 10), 0);
    const from       = system.ensure(parseInt(req.query.from, 10), 0);
    const count      = system.ensure(parseInt(req.query.count, 10), 20);
    const searchQuery = system.ensure(req.query.searchQuery, null);
    const hashtagId  = system.ensure(parseInt(req.query.hashtagId, 10), 0);
    const isLike     = system.ensure(Boolean(req.query.isLike), false);
    const sort       = system.ensure(req.query.sort, "desc");
    const sortMethod = system.ensure(req.query.sortMethod, "date");


    let method = " createdAt ";
    if(sortMethod === "hit") {
        method = " hitAmount ";
    }else if(sortMethod === "like") {
        method = " likeAmount ";
    }
    if(sort !== "desc" && sort !== "asc") { return res.json(C.INVALID_BODY_DATA); }       

    database.getHashtagList(userId, from, count, sort, searchQuery, hashtagId, isLike, suserId, method, (err, list) => {

        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            hashtags : list
        }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /hashtag/list/count /list/count
 *  @apiName get-hashtag-list-count
 *  @apiGroup hashtag
 *  @apiDescription 해시태그 갯수 가져오기
 *  @apiPermission 없음

 *  @apiParam {string}    sortMethod="date"      [query] 정렬방법 (date / hit / like )
 *  @apiParam {string}    sort="desc"            [query] 정렬순서 ( desc / asc )
 *  @apiParam {string}    [searchQuery]   [query] 검색쿼리
 *  @apiParam {integer}   [hashtagId]     [query] 해당 해시태그와 관련있는 해시태그 불러오기
 *  @apiParam {boolean}   [isLike=false]  [query] 세션사용자가 좋아요한 게시물만 가져오기(세션없으면 무시)
 *  @apiParam {boolean}   [userId=0]      [query] 해시태그 목록 가져올 사용자

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list/count", function(req, res, next) {

    const userId      = req.user ? req.user.userId : 0;
    const suserId     = system.ensure(parseInt(req.query.userId, 10), 0);
    const searchQuery = system.ensure(req.query.searchQuery, null);
    const hashtagId   = system.ensure(parseInt(req.query.hashtagId, 10), 0);
    const isLike      = system.ensure(Boolean(req.query.isLike), false);
    const sort        = system.ensure(req.query.sort, "desc");
    const sortMethod  = system.ensure(req.query.sortMethod, "date");


    let method = " createdAt ";
    if(sortMethod === "hit") {
        method = " hitAmount ";
    }else if(sortMethod === "like") {
        method = " likeAmount ";
    }
    if(sort !== "desc" && sort !== "asc") { return res.json(C.INVALID_BODY_DATA); }       

    database.getHashtagListCount(userId, sort, searchQuery, hashtagId, isLike, suserId, method, (err, value) => {

        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /hashtag/:hashtagId/like /:hashtagId/like
 *  @apiName post-hashtag-like
 *  @apiGroup hashtag
 *  @apiDescription hashtag 좋아요
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {integer}   hashtagId  [params] hashtagId
 *  @apiParam {boolean}   like       [body] 좋아요 플래그(true, false)

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 415, description : "잘못된 파라미터 데이터 입니다." }
 */
router.post("/:hashtagId/like", middle.isLogin, function(req, res, next) {

    const user      = req.user;
    const hashtagId = system.ensure(parseInt(req.params.hashtagId, 10), 0);
    const like      = system.boolean(req.body.like);
    console.log(like);
    console.log(req.body.like);
    if(hashtagId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.likeHashtag(user.userId, hashtagId, like, (err, data) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(data));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /hashtag/:hashtagId/update /:hashtagId/update
 *  @apiName post-hashtag-update
 *  @apiGroup hashtag
 *  @apiDescription hashtag 정보 업데이트
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {string}   imageUrl       [body] imageUrl 경로

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 415, description : "잘못된 파라미터 데이터 입니다." }
 */
router.post("/:hashtagId/update", function(req, res, next) {
    /*middle.isLogin*/
    console.log('ddddddddddddddddddd=================');
    const user      = req.user;
    const hashtagId = system.ensure(parseInt(req.params.hashtagId, 10), 0);
    const imageUrl  = system.ensure(req.body.imageUrl, null);

    database.updateTagUrl(user.userId, hashtagId, imageUrl, (err, data) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /hashtag/:hashtagId /:hashtagId
 *  @apiName get-hashtag-:hashtagId
 *  @apiGroup hashtag
 *  @apiDescription 해시태그 상세 정보 가져오기
 *  @apiPermission 없음

 *  @apiParam {string}   hashtagId   [params] hashtagId

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      hashtag : {
 *          hashtagId  : "integer",
 *          hashtag    : "string",
 *          imageUrl   : "string",
 *          likeAmount : "integer",
 *          isLike     : "boolean",
 *          updatedAt  : "date"
 *      }
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/:hashtagId", function(req, res, next) {

    const user      = req.user;
    const userId    = user ? user.userId : 0;
    const hashtagId = system.ensure(parseInt(req.params.hashtagId, 0), 0);    

    database.getHashtagInfo(userId, hashtagId, (err, tagInfo) => {

        tagInfo = _.isUndefined(tagInfo) ? null : tagInfo;
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            hashtag : tagInfo
        }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /hashtag/hit/increase /hit/increase
 *  @apiName post-hashtag-hit-increase
 *  @apiGroup hashtag
 *  @apiDescription hashtag TABLE에 hitAmount 를 + 1
 *  @apiPermission 없음

 *  @apiParam {integer}   hashtagId   [body] hashtagId

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK


 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/hit/increase", function(req, res, next) {

    const hashtagId = system.ensure(parseInt(req.body.hashtagId, 10), 0);
    if(hashtagId < 0) { return res.json(C.INVALID_BODY_DATA); }

    database.HashtagHitIncrease(hashtagId, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});