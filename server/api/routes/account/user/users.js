"use strict";

  
const express  = require("express");
const async    = require("async");
const _        = require("underscore");
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
 *  @api {GET} /account/user/list /list
 *  @apiName get-account-user-list
 *  @apiGroup Account>user
 *  @apiDescription 사용자목록 불러오기:
 *  @apiPermission

 *  @apiParam {integer}   [from=0]        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]      [query] 특정 개수만큼 불러온다
 *  @apiParam {string}    [searchQuery]   [query] 검색 쿼리
 *  @apiParam {integer}   [userId]        [query] 사용자 아이디
 *  @apiParam {integer}   [hashtagId]     [query] 해당 해시태그에 속하는 사용자 불러오기
 *  @apiParam {integer}   [type]          [query] 해당하는 사용자목록 불러온다 (0=일반사용자, 1=관리자, 2=셀레버)

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
 *          mileage     : "integer",
 *          coin        : "integer",
 *          memo        : "string",
 *          type        : "integer",
 *          isFollow    : "boolean",
 *          followerAmount: "integer",
 *          followingAmount : "integer",
 *          hashtags: [{
 *              hashtagId : "integer",
 *              hashtag   : "string",
 *              imageUrl  : "string",
 *              updatedAt : "date",
 *          }],
 *          createdAt   : "Date"
 *          updatedAt   : "Date"
 *      }, ... ]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list", function(req, res, next) {
    const sessionUserId        = req.user? req.user.userId : 0;
    const from        = req.query.from ? parseInt(req.query.from, 10) : 0;
    const count       = req.query.count ? parseInt(req.query.count, 10) : 20;
    const userId      = req.query.userId ? parseInt(req.query.userId, 10) : 0;
    const searchQuery = req.query.searchQuery || null;
    const hashtagId   = system.ensure(parseInt(req.query.hashtagId, 10), 0);
    const type        = system.ensure(parseInt(req.query.type, 10), 0);
    // 기본적인 정렬은 createAt 순
    database.getUsers(type, from, count, userId, searchQuery, hashtagId, sessionUserId, (err, users) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ users : users }));
    });
});

/**
 *  @apiVersion 0.0.1
 *  @api {GET} /account/user/count /count
 *  @apiName get-account-user-count
 *  @apiGroup Account>user
 *  @apiDescription 사용자 수 가져오기
 *  @apiPermission

 *  @apiParam {string}    [searchQuery]   [query] 검색 쿼리
 *  @apiParam {integer}   [hashtagId]     [query] 해당 해시태그에 속하는 사용자 불러오기
 *  @apiParam {integer}   [type]          [query] 해당하는 사용자목록 불러온다 (0=일반사용자, 1=관리자, 2=셀레버)
 *
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/count", function(req, res, next) {

    const searchQuery = req.query.searchQuery || null;
    const type        = system.ensure(parseInt(req.query.type, 10), -1);
    const hashtagId   = system.ensure(parseInt(req.query.hashtagId, 10), 0);

    database.getUserCount(type, hashtagId, searchQuery, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });
});

/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/user/create /create
 *  @apiName post-account-user-create
 *  @apiGroup Account>auth
 *  @apiDescription 사용자 등록

 *  @apiParam {string}   profileUrl         [body] 프로필 이미지 경로
 *  @apiParam {string}   coverUrl           [body] 커버 이미지 경로
 *  @apiParam {string}   [memo]             [body] 셀레버일때만 필요함
 *  @apiParam {string}   name               [body] 이름(닉네임)
 *  @apiParam {array}    [hashtags]         [body] 해시태그 목록 ( hashtag,hashtag,hashtag ',' 구분자로 된 문자열 )
 *  @apiParam {string}   [description]      [body] 셀레버 설명
 *  @apiParam {string}   [descriptionShort] [body] 셀레버 한줄 설명

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      user : {
 *          userId      : "integer",
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
router.post("/create", (req, res, next) => {

    const profile          = system.ensure(req.body.profileUrl, null);
    const cover            = system.ensure(req.body.coverUrl, null);
    const memo             = system.ensure(req.body.memo, null);
    const name             = system.ensure(req.body.name, null);
    const description      = system.ensure(req.body.description, null);
    const descriptionShort = system.ensure(req.body.descriptionShort, null);
    let   hashtags         = system.ensure(req.body.hashtags, null);
    let hashtagArr  = null;
    let hashtagValue   = null;


    async.waterfall([
        (callback) => {
            database.createUser(name, profile, cover, memo, description, descriptionShort,
                (err, user) => {
                    callback(err, user);
            });
        },
        (user, callback) => {

            if(hashtags && hashtags.length > 0) {
                hashtags = JSON.parse(hashtags);
                hashtagArr = _.map(hashtags, item => {
                    if (!item) return;
                    item.replace(" ", "");
                    item.replace("'", "");
                    return "('" + item + "')";
                }).join(",");
                hashtagValue = _.map(hashtags, item => {
                    if (!item) return;
                    item = "'" + item + "'";
                    return item;
                }).join(",");
            } else {
                return callback(null, user);
            }
            database.updateHashtagUser(user.userId, hashtagArr, hashtagValue, (err) => {
                callback(err, user);
            });
        }
    ],
    (err, user) => {
        if (err) { return res.json(err.value); }
        database.ES.create.user(user.userId, name, description, descriptionShort, hashtags, 2);
        return res.json(C.DATA({ user : user }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/user/update /user/update
 *  @apiName post-account-user-update
 *  @apiGroup Account>user
 *  @apiDescription 계정 업데이트

 *  @apiParam {integer}  userId             [body] 수정할 사용자 아이디
 *  @apiParam {string}   profileUrl         [body] 프로필 이미지 경로
 *  @apiParam {string}   coverUrl           [body] 커버 이미지 경로
 *  @apiParam {string}   [memo]             [body] 셀레버일때만 필요함
 *  @apiParam {string}   name               [body] 이름(닉네임)
 *  @apiParam {array}    [hashtags]         [body] 해시태그 목록 ( hashtagId,hashtagId,hashtagId ',' 구분자로 된 문자열 )
 *  @apiParam {string}   [description]      [body] 셀레버 설명
 *  @apiParam {string}   [descriptionShort] [body] 셀레버 한줄 설명

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", function(req, res, next) {
    const userId           = system.ensure(parseInt(req.body.userId, 10), 0);
    const profile          = system.ensure(req.body.profileUrl, null);
    const cover            = system.ensure(req.body.coverUrl, null);
    const memo             = system.ensure(req.body.memo, null);
    const name             = system.ensure(req.body.name, null);
    const description      = system.ensure(req.body.description, null);
    const descriptionShort = system.ensure(req.body.descriptionShort, null);
    let hashtags         = system.ensure(req.body.hashtags, null);
    let hashtagArr  = null;
    let hashtagValue   = null;

    async.waterfall([
            (callback) => {
                database.updateUser(userId, name, profile, cover, memo, description, descriptionShort,
                    (err, user) => {
                        callback(err, user);
                    });
            },
            (user, callback) => { //user null값임
                if(hashtags && hashtags.length > 0) {
                    hashtags = JSON.parse(hashtags);
                    hashtagArr = _.map(hashtags, item => {
                        if (!item) return;
                        item.replace(" ", "");
                        item.replace("'", "");
                        return "('" + item + "')";
                    }).join(",");
                    hashtagValue = _.map(hashtags, item => {
                        if (!item) return;
                        item = "'" + item + "'";
                        return item;
                    }).join(",");
                } else {
                    return callback(null, user);
                }
                database.updateHashtagUser(userId, hashtagArr, hashtagValue, (err) => {
                    console.log(err);
                    callback(err, user);
                });
            }
        ],
        (err, user) => {
            if (err) { return res.json(err.value); }
            database.ES.create.user(userId, name, description, descriptionShort, hashtags, 2);
            return res.json(C.OK);
        });
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /account/user/priority /priority
 *  @apiName get-account-user-priority
 *  @apiGroup Account>user
 *  @apiDescription 해시태그 순으로 우선순위 높은 사람들 불러오기:
 *  @apiPermission

 *  @apiParam {integer}  userid           [query] 조회할 사용자 아이디
 *  @apiParam {integer}   [from=0]        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]      [query] 특정 개수만큼 불러온다

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      users : [{
 *          userInfo : {
 *              userId      : "integer",
 *              name        : "string",
 *              profileUrl  : "string",
 *              coverUrl    : "string",
 *              type        : "integer"
 *          },
 *          count : "integer"
 *      }, ... ]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/priority", function(req, res, next) {
    
    const from   = system.ensure(parseInt(req.query.from, 10), 0);
    const count  = system.ensure(parseInt(req.query.count, 10) , 20);
    const userId = system.ensure(parseInt(req.query.userId, 10), 0);

    database.getPriorityUsers(userId, from, count, (err, users) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({ users : users }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /account/user/priority/count /priority/count
 *  @apiName get-account-user-priority-count
 *  @apiGroup Account>user
 *  @apiDescription 해시태그 순으로 우선순위 높은 사람들 갯수
 *  @apiPermission

 *  @apiParam {integer}  userid [query] 조회할 사용자 아이디
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/priority/count", function(req, res, next) {
    
    const userId = system.ensure(parseInt(req.query.userId, 10), 0);

    database.getPriorityUsersCount(userId, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /account/user/delete /user/delete
 *  @apiName delete-account-user-delete
 *  @apiGroup Account>user
 *  @apiDescription 계정 삭제

*  @apiParam {integer}  userId           [body] 삭제할 사용자 아이디

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/delete", function(req, res, next) {

    const userId = system.ensure(parseInt(req.body.userId, 10), 0);
    database.deleteAccount(userId, (err) => {
        if(err) { return res.json(err.value); }
        database.ES.delete.user(userId);
        return res.json(C.OK);
    });
});
