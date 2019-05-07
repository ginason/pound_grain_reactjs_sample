"use strict";


const assert  = require("assert");
const _       = require("underscore");
const CODE    = require("../../system/code");
const pnumber = require("../../system/phonenumber");


describe("PhoneNumber Utility", function() {
   
    it("region code can be number or number string", function() {
        assert.equal(pnumber.isMobile(82, "01040500908"), true);
        assert.equal(pnumber.isMobile(82, "1040500908"), true);
        assert.equal(pnumber.isMobile("82", "01040500908"), true);
        assert.equal(pnumber.isMobile("82", "1040500908"), true);

        assert.equal(pnumber.isMobile("KR", null), true);
        assert.equal(pnumber.isMobile(null, "1040500908"), false);
        assert.equal(pnumber.NumberInfo(null, "1040500908"), null);
    });


    it("region code should be 2 characters", function() {
        assert.equal(pnumber.isMobile("KR", "01040500908"), true);
        assert.equal(pnumber.isMobile("KOR", "01040500908"), false);
    });


    it("info should be right format", function() {
        const info = pnumber.NumberInfo("KR", "01040500908");
        assert.equal(info.country === 82, true);
        assert.equal(info.region === "KR", true);
        assert.equal(info.number === "1040500908", true);
        assert.equal(info.total === "+821040500908", true);

        let wronginfo = pnumber.NumberInfo("KOR", "01040500908");
        assert.equal(_.isNull(wronginfo), true);
        
        wronginfo = pnumber.NumberInfo("KR", "01040500908123123");
        assert.equal(_.isNull(wronginfo), true);
    });
});