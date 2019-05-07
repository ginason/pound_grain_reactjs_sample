"use strict";

  
const express  = require("express");
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
 *  @api {GET} /notification/list /list
 *  @apiName get-notification-list
 *  @apiGroup notification
 *  @apiDescription 알람 목록 불러오기
 *  @apiPermission 일반사용자

 *  @apiParam {integer}   [from=0]        [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]      [query] 특정 개수만큼 불러온다
 *
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      notifications : [{
 *          notificationId : "integer",
 *          userId         : "integer",
 *          type           : "string",
 *          isChecked      : "boolean",
 *          createdAt      : "date"
 *
 *          // 아래는 type에 따라서, contentId를 기반으로 값을 받아온다.
 *          // IF type = PRODUCT_LIKE, PRODUCT_COMMENT, PRODUCT_NEW, FUNDING_COMPLETE, FUNDING_FAIL
 *          product     : {
 *              productId : "integer",
 *              title     : "string",
 *              imageUrl  : "string"
 *              store     : {
 *                  userId     : "integer",
 *                  name       : "string",
 *                  type       : "integer",
 *                  profileUrl : "string"
 *              },
 *          },
 *          // IF type = FOLLOWING
 *          user        : {
 *              userId     : "integer",
 *              name       : "string",
 *              type       : "integer",
 *              profileUrl : "string" 
 *          }
 *      }]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list", middle.isLogin, function(req, res, next) {

    const user  = req.user;
    const from  = system.ensure(parseInt(req.query.from, 10), 0);
    const count = system.ensure(parseInt(req.query.count, 10), 20);
    database.getNotificationList(user.userId, from, count, (err, list) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            notifications : list
        }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /notification/update /update
 *  @apiName post-notification-update
 *  @apiGroup notification
 *  @apiDescription 알람 읽음.
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {integer}   notificationId  [body] notificationId
 *  @apiParam {integer}   isChecked=true  [body] 알람을 읽을 경우, true로 바꾸어주어야 함


 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", middle.isLogin, function(req, res, next) {

    const user           = req.user;
    const notificationId = system.ensure(parseInt(req.body.notificationId, 10), 0);
    const isChecked      = system.boolean(req.body.isChecked);

    if(notificationId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.updateNotification(user.userId, notificationId, isChecked, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});

