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
 *  @api {GET} /comment/:productId/list /:productId/list
 *  @apiName get-comment-list
 *  @apiGroup comment
 *  @apiDescription 댓글 목록 불러오기
 *  @apiPermission 없음

 *  @apiParam {integer}   from=0               [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   count=20             [query] 특정 개수만큼 불러온다
 *  @apiParam {integer}   [productId]          [params] 상품의 id
 *  @apiParam {integer}   [commentParentId]    [query] 부모댓글의 id (댓글의 댓글을 불러올 때 사용)
 *  @apiParam {integer}   [from=0]             [query] 특정 순서부터 불러온다
 *  @apiParam {integer}   [count=20]           [query] 특정 개수만큼 불러온다
 

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      comments : [{
 *          commentId       : "integer",
 *          commentParentId : "integer",
 *          productId       : "string",
 *          resCount        : "integer",
 *          user        : {
 *              userId      : "integer",
 *              name        : "string",
 *              type        : "integer",
 *              profileUrl  : "string",
 *              coverUrl    : "string"
 *          },
 *          comment         : "string",
 *          likeAmount      : "integer",
 *          isLike          : "boolean",
 *          createdAt       : "date",
 *      }]
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/:productId/list", function(req, res, next) {

    const user            = req.user;
    const productId       = system.ensure(parseInt(req.params.productId, 10), 0);
    const commentParentId = system.ensure(parseInt(req.query.commentParentId, 10), -1);
    const from            = system.ensure(parseInt(req.query.from, 10), 0);
    const count           = system.ensure(parseInt(req.query.count, 10), 20);    

    if(productId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.getCommentList(user ? user.userId : 0, productId, commentParentId, from, count, 
        (err, list) => {
            if(err) { return res.json(err.value); }
            return res.json(C.DATA({
                comments : list
            }));
    });
});

/**
 *  @apiVersion 0.0.1
 *  @api {POST} /comment/:productId/like /:productId/like
 *  @apiName post-comment-like
 *  @apiGroup comment
 *  @apiDescription comment 좋아요
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {integer}   commentId  [params] commentId
 *  @apiParam {boolean}   [delete]   [body] delete 여부 ( 없으면 추가 )

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 415, description : "잘못된 파라미터 데이터 입니다." }
 */
router.post("/:commentId/like", middle.isLogin, function(req, res, next) {
    
    const user       = req.user;
    const commentId  = system.ensure(parseInt(req.params.commentId, 10), 0);
    const delComment = system.boolean(req.body.delete);

    console.log(req.params.commentId);
    console.log(delComment);

    if(commentId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.likeComments(user.userId, commentId, delComment, (err, data) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA(data));
    });
});


/**
 *  @apiVersion 0.0.1
 *  @api {POST} /comment/update /update
 *  @apiName post-comment-update
 *  @apiGroup comment
 *  @apiDescription comment TABLE에 정보 INSERT/UPDATE/DELETE
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {integer}   [commentId]         [body] commentId값이 있으면 기존 정보를 update/delete함 - 없으면 create함
 *  @apiParam {integer}   [commentParentId]   [body] 댓글의댓글일 때, 부모 댓글의 id
 *  @apiParam {integer}   [productId]         [body] productId
 *  @apiParam {string}    [comment]           [body] 커멘트
 *  @apiParam {boolean}   [isDeleted]         [body] 삭제를 원하면 true로 값을 보낸다.


 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      count : {integer}
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.post("/update", middle.isLogin, function(req, res, next) {
    // commentId가 있으면 UPDATE, 없으면 CREATE
    // isDeleted=true면 DELETE
    const user            = req.user;
    const productId       = system.ensure(parseInt(req.body.productId, 10), 0);
    const commentId       = system.ensure(parseInt(req.body.commentId, 10), 0);
    const commentParentId = system.ensure(parseInt(req.body.commentParentId, 10), 0);
    const comment         = system.ensure(req.body.comment, null);
    const isDeleted       = system.ensure(Boolean(req.body.isDeleted), false);

    if(productId <= 0) { return res.json(C.INVALID_PARAM_DATA); }

    database.updateComment(user.userId, productId, commentId, commentParentId,  comment, isDeleted, (err, value) => {
        if(err) { return res.json(err.value); }
        return res.json(C.DATA({
            comment : value
        }));
    });    
});


/**
 *  @apiVersion 0.0.1
 *  @api {GET} /comment/:productId/count /:productId/count
 *  @apiName get-comment-productId-count
 *  @apiGroup comment
 *  @apiDescription comment 갯수 가져오기
 *  @apiPermission 일반사용자 (type=1)

 *  @apiParam {integer}   [productId]   [params] 제품 아이디
 
 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      total : "integer", // 전체 갯수
 *      count : "integer"  // 대댓글 뺀 댓글 갯수
 *  }

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/:productId/count", function(req, res, next) {

    const user      = req.user;
    const productId = system.ensure(parseInt(req.params.productId, 10), 0);

    database.getCommentCount(productId, (err, result) => {
        if(err) { return res.json(err.value); }
        return res.json(result);
    });
});