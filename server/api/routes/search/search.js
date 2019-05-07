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
 *  @api {GET} /search/topSearchQueries /topSearchQueries
 *  @apiName get-search-topSearchQueries
 *  @apiGroup search
 *  @apiDescription 가장 많이 검색된 검색어 top 10
 *  @apiPermission

 *  @apiParam {string}    searchQuery  [query] 검색어

 *  @apiSuccessExample  Success-Response:
 *  HTTP/1.1 200 OK

 *  @apiErrorExample {text} Error-Response:
 *  HTTP/1.1 200 OK
 *  { code : 404, description : "invalid body data." }
 */
router.get("/topSearchQueries", (req, res) => {
    const searchQuery      = req.query.searchQuery;
    if(!searchQuery) { return res.json(C.INVALID_BODY_DATA); }

    database.ES.search.searchHistory.topSearchQueries(searchQuery, 0, 10, (err, topSearchQueries) => {
        return res.json(C.DATA(topSearchQueries));
    });
});
