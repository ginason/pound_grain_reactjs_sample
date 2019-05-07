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
 *  @api {GET} /product/one/:productId /one/:productId
 *  @apiName get-product-one-product-Id
 *  @apiGroup product
 *  @apiDescription 상품 한개 정보만 불러오기
 *  @apiPermission 없음

 *  @apiParam {integer}   productId    [params] 특정 id의 상품만 불러온다.

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      product : {
 *          productId    : "integer",
 *          storeInfo    : {
 *              userId      : "integer",
 *              name        : "string",
 *              type        : "integer",
 *              profileUrl  : "string",
 *              coverUrl    : "string"
 *          },
 *          title        : "string",
 *          description  : "string",
 *          saleAmount   : "integer", // 판매개수
 *          likeAmount   : "integer", // 좋아요 수
 *          hitAmount    : "integer", // 조회수
 *          currency     : "string", // 국내서비스는 기본이 KRW 이다.
 *          price        : "integer",
 *          isDeleted    : "boolean",
 *          createdAt    : "date",
 *          hashtags     : [{
 *              hashtagId    : "integer",
 *              hashtag      : "string",
 *              imageUrl     : "string",
 *              updatedAt    : "date",
 *          }],
 *          optionInfo : [{
 *              optionId          : "integer",
 *              title             : "string",
 *              description       : "string", 
 *              currency          : "string",
 *              price             : "integer", 
 *              deliveryPrice     : "integer", 
 *              deliverAt         : "date",
 *              inventoryQuantity : "integer"
 *              saleAmount        : "integer",
 *              updatedAt         : "date",
 *              createdAt         : "date",
 *              fileUrl           : "string"
 *          }], 
 *          category     : "integer",
 *
 *          // 일반상품의 경우만 있는 field
 *          
 *          // 펀딩상품의 경우만 있는 field
 *          goalToRaise  : "integer",
 *          currentRaise : "integer",
 *          startAt      : "date",
 *          endAt        : "date",
 *
 *          // 비디오의 경우만 있는 field
 *          youtubeUrl   : "string",  // 유투브 URL
 *          seconds      : "integer", // 영상 길이 (초)
 *          
 *          // 좋아요 여부
 *          isLike       : "boolean" 
 *      }
 *  }

 B.optionId, B.currency, B.price, B.deliveryPrice, B.deliverAt, B.inventoryQuantity,
        B.saleAmount, B.updatedAt,

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/one/:productId", function(req, res, next) {

    const user      = req.user;
    const userId    = user ? user.userId : 0;
    const productId = system.ensure(parseInt(req.params.productId, 10), 0);
    if(productId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.getOneProduct(userId, productId, (err, product) => {

        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            product : product
        }));
    });
});




/**
 *  @apiVersion 0.0.1
 *  @api {GET} /product/list /list
 *  @apiName get-product-list
 *  @apiGroup product
 *  @apiDescription 상품목록 불러오기. 서비스와 관리자에서 모두 동일한 API를 사용한다.
 *  @apiPermission 없음

 *  @apiParam {integer}   from=0                 [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   count=20               [query] 특정 개수만큼 불러온다
 *  @apiParam {integer}   [userId=0]             [query] 특정 사용자 제품만 받아오는 조건
 *  @apiParam {string}    [searchQuery]          [query] 검색어
 *
 *  좋아요 목록 API를 한 개의 API로 통합
 *  @apiParam {boolean}   [isLike=false]         [query] 좋아요한 상품만 불러오기
 *
 *  아래는 서비스의 필터기능을 위해 필요
 *  @apiParam {string}    sortMethod="date"      [query] 정렬방법 ( date / hit / like / raise / delete / current / end )
 *  @apiParam {string}    sort="desc"            [query] 정렬순서 ( desc / asc )
 *  @apiParam {integer}   [hashtagId]            [query] 해당 해시태그에 속하는 상품/펀딩/비디오 불러오기
 *  @apiParam {boolean}   isNormal               [query] false이면, 일반상품 제외
 *  @apiParam {boolean}   isFunding              [query] false이면, 펀딩상품 제외
 *  @apiParam {boolean}   isVideo                [query] false이면, 비디오 제외
 *  @apiParam {boolean}   [isDigitalContent=false]       [query] false이면, 디지털콘텐츠 제외
 *  @apiParam {array}     [category]             [query] 카테고리 번호
 *  
 *  관리자를 위해 필요
 *  @apiParam {boolean}   [includeDeleted=false] [query] true이면, 삭제된 내역도 같이 불러온다.

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      products : [{
 *          productId    : "integer",
 *          storeInfo    : {
 *              userId      : "integer",
 *              name        : "string",
 *              type        : "integer",
 *              profileUrl  : "string",
 *              coverUrl    : "string"
 *          },
 *          title        : "string",
 *          description  : "string",
 *          descriptionShort  : "string",
 *          saleAmount   : "integer", // 판매개수
 *          likeAmount   : "integer", // 좋아요 수
 *          hitAmount    : "integer", // 조회수
 *          currency     : "string", // 국내서비스는 기본이 KRW 이다.
 *          price        : "integer", // 상품 가격 (첫번째 옵션의 가격을 넣어준다)
 *          isDeleted    : "boolean",
 *          createdAt    : "date",
 *          type         : "integer",
 *          hashtags: [{
 *              hashtagId : "integer",
 *              hashtag   : "string",
 *              imageUrl  : "string",
 *              updatedAt : "date",
 *          }],
 *          optionInfo : [{
 *              optionId          : "integer",
 *              title             : "string",
 *              description       : "string", 
 *              currency          : "string",
 *              price             : "integer", 
 *              deliveryPrice     : "integer", 
 *              deliverAt         : "date",
 *              inventoryQuantity : "integer"
 *              saleAmount        : "integer",
 *              updatedAt         : "date",
 *              createdAt         : "date",
 *              fileUrl         : "string"
 *          }],  
 *          category     : "integer",
 *
 *          // 일반상품의 경우만 있는 field
 *          
 *          // 펀딩상품의 경우만 있는 field
 *          goalToRaise  : "integer",  // 목표 모금액
 *          currentRaise : "integer", // 현재 모금액
 *          startAt      : "date",
 *          endAt        : "date",
 *
 *          // 비디오의 경우만 있는 field
 *          youtubeUrl   : "string",  // 유투브 URL
 *          seconds      : "integer", // 영상 길이 (초)
 *          
 *          // 좋아요 여부
 *          isLike       : "boolean" 
 *      }, ... ]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/list", function(req, res, next) {
    const user        = req.user;
    const userId      = user ? user.userId : 0;
    const searchQuery = system.ensure(req.query.searchQuery, null);
    const from        = system.ensure(parseInt(req.query.from, 10), 0);
    const count       = system.ensure(parseInt(req.query.count, 10), 20);
    const sort        = system.ensure(req.query.sort, "desc");
    let sortMethod  = system.ensure(req.query.sortMethod, "date");
    let category    = system.ensure(req.query.category, null);
    const isLike      = system.boolean(req.query.isLike); 
    const isNormal    = system.boolean(req.query.isNormal);
    const isFunding   = system.boolean(req.query.isFunding);
    const isVideo     = system.boolean(req.query.isVideo);
    const isDigitalContent = system.boolean(req.query.isDigitalContent) || false;
    const hashtagId   = system.ensure(parseInt(req.query.hashtagId, 10), 0);
    const suserId     = system.ensure(parseInt(req.query.userId, 10), 0);
    const includeDeleted = system.boolean(req.query.includeDeleted);

    let _method = null;
    if(sortMethod === "hit") {
        sortMethod = " A.hitAmount ";
    } else if(sortMethod === "like") {
        sortMethod = " A.likeAmount ";
    } else if(sortMethod === "raise") {
        sortMethod = " B.goalToRaise ";
    } else if(sortMethod === "current") {
        _method = sortMethod;
        sortMethod = " A.createdAt ";
    } else if(sortMethod === "end") {
        _method = sortMethod;
        sortMethod = " A.createdAt ";
    } else if(sortMethod === "productId") {
        _method = sortMethod;
        sortMethod = " A.productId ";
    } else if(sortMethod === "delete") {
        sortMethod = " A.isDeleted ";
    } else {
        sortMethod = " A.createdAt ";
    }

    if(sort !== "desc" && sort !== "asc") { return res.json(C.INVALID_BODY_DATA); }
    if(isNaN(from) || isNaN(count)) { return res.json(C.INVALID_BODY_DATA); }


    if(_.isArray(category)) {
        category = category.join(",");
    }
    else if(category === "0") {
        category = null;
    }

    try {

        database.getProducts(userId, from, count, sort, category, isLike,
            isNormal, isFunding, isVideo, sortMethod, hashtagId, suserId, searchQuery, isDigitalContent, _method,
            includeDeleted, (err, products) => {
                if(err) { return res.json(err.value); }


                // current sortMethod 부분은 product/list에서  type=1 (펀딩) 일때
                //     typeInfo 에서 (currentRaise / goalToRaise *100) 을 했을때 값이
                //     큰순서로 출력 해주셔야 할거같아요
                //     이때 endAt이 현재 날짜와 시간 보다 이후 값을 출력해 주셔야 할거같아요.

                // end sortMethod 는 마찬가지로 product/list에서  type=1 (펀딩) 일때
                // typeInfo 안 에서 endAt에 따라서 최근순으로 해주시면되는데
                // 이때 endAt이 현재 날짜와 시간 보다 이후 값으로 출력이 되야 할거같아요.

                // type=1 (funding) 이면서 endAt 이 today 이후 날짜 출력 되도록 하는건
                // current 이랑 end는 공통이예요.

                // current 는 (currentRaise / goalToRaise *100) 이 큰순서 ,
                // end는 endAt 이 today 부터 가까운 순으로 출력하면 될거같아요. 쫌 복잡하긴해요 ㅜㅜ


                // let _filtered = _.each(products, function(item) {
                //     f(_method === "current") {
                //         return 0;
                //     }
                //     return item.typeInfo.currentRaise / item.typeInfo.goalToRaise * 100;
                // });


                if(_method === "current") {
                    products = _.sortBy(products, function(item) {
                        // if((item.type !== 1) || !item.typeInfo) {
                        //     return 0;
                        // }
                        return item.typeInfo.currentRaise / item.typeInfo.goalToRaise * 100;
                    });
                }
                else if(_method === "end") {
                    products = _.sortBy(products, function(item) {
                        // if((item.type !== 1) || !item.typeInfo) {
                        //     return 0;
                        // }
                        return item.typeInfo.endAt;
                    });
                }

                return res.json(C.DATA({
                    products : products ? products : []
                }));
            });
    } catch (e) {
        console.log(e);
    }
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /product/count /count
 *  @apiName get-product-count
 *  @apiGroup product
 *  @apiDescription 상품목록 전체 개수. 서비스와 관리자에서 모두 동일한 API를 사용한다.
 *  @apiPermission 없음

 *  아래는 서비스의 필터기능을 위해 필요
 *  @apiParam {boolean}   [isNormal=true]   [query] false이면, 일반상품 제외
 *  @apiParam {boolean}   [isFunding=true]  [query] false이면, 펀딩상품 제외
 *  @apiParam {boolean}   [isVideo=false]   [query] false이면, 비디오 제외
 *  @apiParam {array}   [category]        [query] 카테고리 번호
 *  @apiParam {string}    [searchQuery]     [query] 검색어
 *
 *  관리자를 위해 필요
 *  @apiParam {boolean}   [includeDeleted=false] true이면, 삭제된 내역도 같이 불러온다.
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

    const user           = req.user;
    const userId         = user ? user.userId : 0;
    const searchQuery    = req.query.searchQuery || null;
    const category       = utils.ensure(parseInt(req.query.category, 10), 0);
    const isNormal       = system.boolean(req.query.isNormal);
    const isFunding      = system.boolean(req.query.isFunding);
    const isVideo        = system.boolean(req.query.isVideo);
    const includeDeleted = system.boolean(req.query.includeDeleted);

    database.productCount(userId, category, isNormal, isFunding, isVideo, includeDeleted, searchQuery,
        (err, count) => {
            if(err) { return res.json(err.value); }
            return res.json(C.DATA(count));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /product/update /update
 *  @apiName post-product-update
 *  @apiGroup product
 *  @apiDescription product TABLE에 정보 INSERT/UPDATE/DELETE
 *  @apiPermission 관리자

 *  @apiParam {string}    [imageUrl]         [body] 이미지 경로
 *  @apiParam {string}    [title]            [body] 상품 제목
 *  @apiParam {integer}   [storeId]          [body] 셀레버의 userId
 *  @apiParam {integer}   [goalToRaise]      [body] (funding) 목표 모집 금액
 *  @apiParam {integer}   [category]         [body] 카테고리
 *  @apiParam {date}      [startAt]          [body] (funding) 펀딩 시작일
 *  @apiParam {date}      [endAt]            [body] (funding) 펀딩 종료일
 *  @apiParam {array}     [hashtags]         [body] 해시태그 목록 (hashtag,hashtag,hashtag ',' 구분자로 된 문자열 )
 *  @apiParam {string}    [descriptionShort] [body] 상품 간단설명
 *  @apiParam {string}    [description]      [body] 상품 설명
 *  @apiParam {integer}   [type]             [body] 제품 타입( 0 :  NORMAL , 1 : FUNDING, 2 : VIDEO )

 *  @apiParam {integer}   [seconds]          [body] (video) 재생시간(초)
 *  @apiParam {string}    [youtubeUrl]       [body] (video) 유투브 URL
 *  @apiParam {integer}   [currency]          [body] 통화 (krw / coin / mile)

 *  @apiParam {integer}   [productId]        [body] productId값이 있으면 기존 정보를 update함 / 없으면 create함
 *  @apiParam {boolean}   [isDeleted]        [body] 삭제를 원하면 true로 값을 보낸다.

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *          productId : "integer"   
 *  }
 
 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", function(req, res, next) {
    const user        = req.user;
    // const userId      = user.userId;
    const productId   = system.ensure(parseInt(req.body.productId, 10), 0);
    const storeId     = system.ensure(parseInt(req.body.storeId, 10), 0);
    const title       = system.ensure(req.body.title, null);
    const description = system.ensure(req.body.description, null);
    const descShort   = system.ensure(req.body.descriptionShort, null);
    const type        = system.ensure(parseInt(req.body.type, 10), 0);
    const category    = system.ensure(parseInt(req.body.category, 10), 0);
    const goalToRaise = system.ensure(parseInt(req.body.goalToRaise, 10), 0);
    const startAt     = system.ensure(req.body.startAt, null);
    const endAt       = system.ensure(req.body.endAt, null);
    const seconds     = system.ensure(parseInt(req.body.seconds, 10), 0);
    const youtubeUrl  = system.ensure(req.body.youtubeUrl, null);
    let hashtags      = system.ensure(req.body.hashtags, null);
    const isDeleted   = system.boolean(req.body.isDeleted);
    const imageUrl    = system.ensure(req.body.imageUrl, null);
    const currency    = system.ensure(req.body.currency, "krw");
    let hashtagArr  = null;
    let hashtagValue   = null;


    if(!isDeleted) {
        if((storeId <= 0) || (type < 0) || !title) { 
            return res.json(C.INVALID_BODY_DATA); 
        }
        if(type === 0) {
        }
        else if(type === 1) {
            if(goalToRaise <= 0) { return res.json(C.INVALID_BODY_DATA); }
        }
        else if(type === 2) {
            if(!youtubeUrl || seconds <= 0) { return res.json(C.INVALID_BODY_DATA); }
        }
        else { return res.json(C.INVALID_BODY_DATA); }   

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
        }
    }
    database.productUpdate(storeId, productId, title, description, type, category,
        goalToRaise, startAt, endAt, seconds, youtubeUrl, hashtagArr, hashtagValue, isDeleted, descShort, imageUrl, currency,
        (err, result) => {
            if(err) { return res.json(err.value); }
            if (isDeleted) {
                database.ES.delete.product(productId, title, description, descShort, hashtags, category, type);
            } else {
                if(user) {
                    database.ES.create.product(result.productId, title, user.userId, description, descShort, hashtags, category, type, new Date());    
                }
                
            }
            return res.json(C.DATA(result));
        });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /product/option/update /option/update
 *  @apiName post-product-option-update
 *  @apiGroup product
 *  @apiDescription product_option TABLE에 정보 INSERT/UPDATE/DELETE
 *  @apiPermission 관리자

 *  @apiParam {integer}   productId           [body] 옵션이 속한 productId
 *  @apiParam {integer}   [optionId]          [body] optionId값이 있으면 기존 정보를 update함 / 없으면 create함
 *  @apiParam {string}    [title]             [body] 옵션 제목
 *  @apiParam {string}    [description]       [body] 옵션 설명
 *  @apiParam {integer}   [currency]          [body] 통화 (krw / coin / mile)
 *  @apiParam {integer}   [price]             [body] 가격
 *  @apiParam {integer}   [deliveryPrice]     [body] 배송비
 *  @apiParam {integer}   [inventoryQuantity] [body] 재고수량
 *  @apiParam {integer}   [deliverAt]         [body] (funding) 펀딩상품 배송일
 *  @apiParam {string}    [fileUrl]           [body] (디지털 콘텐츠) 파일의 url
 *  @apiParam {boolean}   [isDeleted]         [body] 삭제를 원하면 true로 값을 보낸다.

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  HTTP/1.1 200 OK
 *  {
 *          optionId : "integer"
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/option/update", function(req, res, next) {
    const user        = req.user;
    const productId   = system.ensure(parseInt(req.body.productId, 10), 0);
    const optionId    = system.ensure(parseInt(req.body.optionId, 10), 0);
    const title       = system.ensure(req.body.title, "");
    const description   = system.ensure(req.body.description, "");
    const currency      = system.ensure(req.body.currency, "krw");
    const price         = system.ensure(parseInt(req.body.price, 10), 0);
    const deliveryPrice = system.ensure(parseInt(req.body.deliveryPrice, 10), 0);
    
    const ivQuantity  = system.ensure(parseInt(req.body.inventoryQuantity, 10), 0);
    const deliverAt   = system.ensure(req.body.deliverAt, "");
    const fileUrl   = system.ensure(req.body.fileUrl, "");
    const isDeleted   = system.boolean(req.body.isDeleted);

    if(!isDeleted && productId <= 0) { return res.json(C.INVALID_BODY_DATA); }
    database.productOptionUpdate(user ? user.userId : 0, productId, optionId, title, description,
        currency, price, ivQuantity, deliverAt, deliveryPrice, fileUrl, isDeleted, (err, value) => {
            if(err) { return res.json(err.value); }
            return res.json(C.DATA(value));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /product/hit/increase /hit/increase
 *  @apiName post-product-hit-increase
 *  @apiGroup product
 *  @apiDescription product TABLE에 hitAmount 를 + 1
 *  @apiPermission 없음

 *  @apiParam {integer}   productId   [body] 옵션이 속한 productId

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK


 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/hit/increase", function(req, res, next) {

    const productId = system.ensure(parseInt(req.body.productId, 10), 0);
    if(productId < 0) { return res.json(C.INVALID_BODY_DATA); }

    database.productHitIncrease(productId, (err) => {
        if(err) { return res.json(err.value); }
        return res.json(C.OK);
    });
});