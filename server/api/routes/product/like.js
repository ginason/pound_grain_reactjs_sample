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
 *  @api {POST} /product/like/update /like/update
 *  @apiName post-product-like-update
 *  @apiGroup product>like
 *  @apiDescription 좋아요 하기 / 좋아요 해제
 *  @apiPermission customer

 *  @apiParam {integer}   productId    [body] 특정 상품 Id
 *  @apiParam {boolean}   isLike       [body] true=좋아요하기 /  false=좋아요 해제

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", middle.isLogin, function(req, res, next) {
    
    const user      = req.user;
    const userId    = user.userId;
    const productId = parseInt(req.body.productId, 10);
    const isLike    = req.body.isLike;
    if(isNaN(productId)) { return res.json(C.INVALID_BODY_DATA); }

    database.productLike(user.userId, productId, isLike, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});
