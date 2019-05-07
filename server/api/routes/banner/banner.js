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
 *  @api {GET} /banner/list /list
 *  @apiName get-banner-list
 *  @apiGroup banner
 *  @apiDescription 배너 목록 불러오기
 *  @apiPermission 없음

 *  @apiParam {integer}   type    [query] 홈=1, 상품=2, 비디오=3

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      banners : [{
 *          bannerId     : "integer",
 *          product      : {
 *              productId    : "integer",
 *              isLike       : "boolean"
 *          },
 *          storeInfo    : {
 *              userId      : "integer",
 *              name        : "string",
 *              type        : "integer",
 *              profileUrl  : "string",
 *              coverUrl    : "string"
 *          },
 *          typeInfo     : {
 *              // type specific Into
 *          }
 *          title        : "string",
 *          price        : "integer",
 *          imageUrl     : "string",
 *          type         : "integer",
 *          order        : "integer",
 *          hitAmount    : "integer",
 *          createdAt    : "date",
 *          updatedAt    : "date",
 *      }]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list", function(req, res, next) {

    const user = req.user;
    const type = system.ensure(parseInt(req.query.type, 10), 0);

    if(type <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.getBannerList(user ? user.userId : 0, type, (err, list) => {

        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            banners : list
        }));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /banner/update /update
 *  @apiName post-banner-update
 *  @apiGroup banner
 *  @apiDescription banner TABLE에 정보 INSERT/UPDATE/DELETE
 *  @apiPermission 관리자

 *  @apiParam {integer}   [bannerId]    [body] bannerId값이 있으면 기존 정보를 update/delete함 - 없으면 create함
 *  @apiParam {integer}   [productId]   [body] productId 0보다 커야 함
 *  @apiParam {string}    [title]       [body] 상품 제목
 *  @apiParam {integer}   [type]        [body] 타입 (1=홈, 2=상품, 3=비디오) 0 보다 커야 함
 *  @apiParam {integer}   [order]       [body] 순서. 0부터 시작
 *  @apiParam {string}    [imageUrl]    [body] 배너 URL image

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      bannerId : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", function(req, res, next) {
    
    const user       = req.user;
    const productId  = system.ensure(parseInt(req.body.productId, 10), 0);  
    const bannerId   = system.ensure(parseInt(req.body.bannerId, 10), 0);
    const title      = system.ensure(req.body.title, null);
    const type       = system.ensure(parseInt(req.body.type, 10), -1);
    const order      = system.ensure(parseInt(req.body.order, 10), -1);
    const imageUrl   = system.ensure(req.body.imageUrl, null);
    
    if(_.isNull(imageUrl) || type < 0 || order < 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.updateBanner(user ? user.userId : 0, productId, bannerId, imageUrl, title, type, order, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(value));
    });    
});

/**
 *  @apiVersion 0.0.1
 *  @api {POST} /banner/create /create
 *  @apiName post-banner-create
 *  @apiGroup banner
 *  @apiDescription banner TABLE에 정보 생성
 *  @apiPermission 관리자

 *  @apiParam {integer}   productId   [body] productId
 *  @apiParam {string}    title       [body] 상품 제목
 *  @apiParam {integer}   type        [body] 타입 (1=홈, 2=상품, 3=비디오)
 *  @apiParam {integer}   order       [body] 순서. 0부터 시작
 *  @apiParam {string}    imageUrl    [body] 배너 URL image 

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      bannerId : "integer"
 *  }


 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/create", function(req, res, next) {
    
    const user      = req.user;
    const productId = system.ensure(parseInt(req.body.productId, 10), 0);
    const title     = system.ensure(req.body.title, null);
    const type      = system.ensure(parseInt(req.body.type, 10), 0);
    const order     = system.ensure(parseInt(req.body.order, 10), -1);
    const imageUrl  = system.ensure(req.body.imageUrl, null);

    if(_.isNull(imageUrl) || productId <= 0 || type <= 0 || order < 0) { return res.json(C.INVALID_BODY_DATA); }

    database.createBanner(user ? user.userId : 0, productId, title, type, order, imageUrl, (err, result) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(result));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /banner/delete /delete
 *  @apiName post-banner-delete
 *  @apiGroup banner
 *  @apiDescription banner TABLE에 정보 DELETE
 *  @apiPermission 관리자

 *  @apiParam {integer}   [bannerId]    [body] bannerId

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/delete", function(req, res, next) {
    
    const user = req.user;
    const bannerId  = system.ensure(parseInt(req.body.bannerId, 10), 0);
    if(bannerId <= 0) { return res.json(C.INVALID_PARAM_DATA); }
    database.deleteBanner(user ? user.userId : 0, bannerId, err => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});


