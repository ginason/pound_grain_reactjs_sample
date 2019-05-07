"use strict";

process.env.NODE_ENV = "intraduction";

const assert   = require("assert");
const _        = require("underscore");
const utils    = require("../../server/api/utils");
const SQLStore = require("../../server/api/database/SQLStore");
const database = require("../../server/api/database");


describe("Database", function() {
    describe("Stored Procedure Organizer", function() {
        it("sp with parameter should have same parameters", function() {

            const store = new SQLStore();
            const qinfo1 = store.makeQuery("sp", 1, 2, 3, 4);
            assert.equal(qinfo1.query === "CALL sp(:0, :1, :2, :3);", true);
            assert.equal(_.has(qinfo1.param, "0"), true);
            assert.equal(_.has(qinfo1.param, "1"), true);
            assert.equal(_.has(qinfo1.param, "2"), true);
            assert.equal(_.has(qinfo1.param, "3"), true);
            assert.equal(_.has(qinfo1.param, "4"), false);
        });

        it("sp with no parameter should not have parameters", function() {

            const store = new SQLStore();
            const qinfo2 = store.makeQuery("sp");
            assert.equal(qinfo2.query === "CALL sp();", true);
            assert.equal(_.has(qinfo2.param, "0"), false);
        });
    });


    describe("Stored Procedure Call", function() {
        it("dbcall test", function() {

            // process.env.NODE_ENV = "local";
            // const store = new SQLStore();

            // const pms = store.call("update_delivery", 1, 1, "", "", "", false);
            // const pms = store.call("get_invoice_list", 1, 1, 1, 1, 1, 1, 1, null, null);
            // const pms = store.call("create_invoice", 1, "", 1);
            // const pms = store.call("create_payment_product", 1, 1, 1, 1, 1, 1, "", 1);
            // const pms = store.call("create_payment_funding", 1, 1, 1, 1, 1, 1, "", 1);
            // const pms = store.call("create_payment_delivery", 1, 1, 1, 1, 1, 1, "", "", "", "");
            // const pms = store.call("create_payment_coin", 1, 1, 1, 1, "", 1);

            
        
            // const pms = store.call("id_exist", "breaklee@naver.com");
            // module.exports.signup = function(type, password, name, countryCode, phoneNumber, profile, cover, stype, sid, token, callback) {
            // const pms = store.call("signup", 0, '44a96d6907a25140210a15b0b9923a5ec117231b44e005ad5d3b6ef8', 'jaemoon', '82', '1040500908', null, null, null, '123123', null);            
            // const pms = store.call("signin", "breaklee@naver.com", "password", null, null, null);
            // const pms = store.call("reset_password", "1", "4321");
            // const pms = store.call("mark_contact", "82", "1040500908", 1234);
            // const pms = store.call("verify_contact", "82", "1040500908", "1234");
            // const pms = store.call("get_session", 3);
            // const pms = store.call("update_account", 1, null, "1222", "111111", "jaem", 1);
            // const pms = store.call("check_contact", "82", "1040500908");
            // pms.then(data => {
            //     console.log("DB", data);
            // }).catch(err => {
            //     console.log(err);
            // });
        });
    });

    describe("Product Procedure Test", function() {
        it("dbcall test", function() {

            // process.env.NODE_ENV = "intraduction";
            // database.getAllCarts(1561, 0, (err, result) => {
            //     console.log(err, result);
            // });            
            // module.exports.productUpdate = (userId, productId, title, description, type, category, goalToRaise, startAt, endAt, seconds, youtubeUrl, hashtags, isDeleted, callback) => {
            // database.productUpdate(1, 2, "title", "description", 2, 11, 11100, new Date(), new Date(), 12, "ㅗㅆ쎼", null, false, (err) => {
            //     console.log(err);
            // });

            // database.getOneProduct(1, 1, (err, product) => {
            //     console.log(err, product);
            // });      

            // module.exports.productCount = (userId, category, isNormal, isFunding, isVideo, callback) => {
            // database.productCount(1, 11, true, true, true, (err, count) => {
            //     console.log(err, count);
            //     // if(err) { return res.json(err.value); }
            //     // return res.json(C.DATA(count));
            // });

            // module.exports.getProducts = (userId, from, count, sort, category, isLike, isNormal, isFunding, isVideo, callback) => {
            // database.getProducts(1, 0, 1000, "new", 11, false, true, true, true, (err, products) => {
            //     console.log(err, products);
            // });
            // database.productLike(1, 1, true, (err) => {
            //     console.log(err);
            // });
            // database.getAllCarts(1, (err, list) => {
            //     console.log(list);
            // });            

            // database.getCommentList(1, 1, 1, (err, result) => {
            //     console.log(err, result);
            // });

            // database.getBannerList(1, 1, (err, list) => {
            //     console.log(err, list);
            // });
            
            // database.getNotificationList(1, (err, list) => {
            //     console.log(err, list);
            // });
            
        });
    });    
});
