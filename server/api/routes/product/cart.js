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
 *  @api {GET} /product/carts/list /carts/list 
 *  @apiName get-product-carts-list
 *  @apiGroup product>cart
 *  @apiDescription 장바구니 불러오기
 *  @apiPermission 일반 사용자

 *  @apiParam {integer}   userId     [query] 특정 사용자 아이디
 *  @apiParam {integer}   type       [query] (product type:     )

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      carts_funding : [{
 *          결과값 생략 (아래 get-product-list 의 결과값과 동일함)
 *      }, ... ],
 *      carts_market : [{
 *          결과값 생략 (아래 get-product-list 의 결과값과 동일함)
 *      }, ... ],
 *      carts_coin : [{
 *          결과값 생략 (아래 get-product-list 의 결과값과 동일함)
 *      }, ... ]
 *      carts_mileage : [{
 *          결과값 생략 (아래 get-product-list 의 결과값과 동일함)
 *      }, ... ],
   *      carts_video : [{
 *          결과값 생략 (아래 get-product-list 의 결과값과 동일함)
 *      }, ... ]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list",  function(req, res, next) {

    let userId = system.ensure(parseInt(req.query.userId, 10), 0);
    const type = system.ensure(parseInt(req.query.type, 10), 0);
    console.log("cartlist!!!!!!")
    if(type < 0 || type > 2) { return res.json(C.INVALID_QUERY_DATA); }
    if(userId <= 0 && req.user) { userId = req.user.userId; }
    database.getAllCarts(userId, type, (err, list) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(list));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /product/cart/create /carts/create
 *  @apiName post-product-cart-create
 *  @apiGroup product>cart
 *  @apiDescription 장바구니 저장하기
 *  @apiPermission 일반 사용자

 *  @apiParam {integer}   productId     [body] 특정 상품 Id
 *  @apiParam {integer}   optionId      [body] 특정 옵션 Id
 *  @apiParam {integer}   quantity      [body] 개수

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      cartId : "integer"
 *  }
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/create", middle.isLogin, function(req, res, next) {
    
    const user      = req.user;
    const productId = parseInt(req.body.productId, 10);
    const optionId  = parseInt(req.body.optionId, 10);
    const quantity  = parseInt(req.body.quantity, 10);

    if(isNaN(productId) || isNaN(optionId) || isNaN(quantity)) { return res.json(C.INVALID_BODY_DATA); }

    database.createCart(user.userId, productId, optionId, quantity, (err, result) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(result));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /product/cart/update /carts/update
 *  @apiName post-product-cart-update
 *  @apiGroup product>cart
 *  @apiDescription 장바구니 개수 수정하기
 *  @apiPermission 일반 사용자

 *  @apiParam {integer}   cartId       [body] 특정 상품 Id
 *  @apiParam {integer}   quantity     [body] 개수

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", middle.isLogin, function(req, res, next) {

    const user     = req.user;
    const cartId   = parseInt(req.body.cartId, 10);
    const quantity = parseInt(req.body.quantity, 10);

    if(isNaN(cartId) || isNaN(quantity)) { return res.json(C.INVALID_BODY_DATA); }

    database.updateCart(user.userId, cartId, quantity, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST}
 *  /product/cart/delete /carts/delete
 *  @apiName post-product-cart-delete
 *  @apiGroup product>cart
 *  @apiDescription 장바구니 삭제하기
 *  @apiPermission 일반 사용자

 *  @apiParam {integer}   cartId        [body] 특정 상품 Id
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/delete", middle.isLogin, function(req, res, next) {

    const user   = req.user;
    const cartId = parseInt(req.body.cartId, 10);
    if(isNaN(cartId)) { return res.json(C.INVALID_BODY_DATA); }

    database.deleteCart(user.userId, cartId, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});

