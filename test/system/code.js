"use strict";


const assert = require("assert");
const _      = require("underscore");
const CODE   = require("../../system/code");


describe("Code Utility", function() {
   
    it("code format should include code property", function() {

        assert.equal(CODE.CODE_FORMAT({code : 0 }), true);
        assert.equal(CODE.CODE_FORMAT({  }), false);
    });
   
    it("check code type with data", function() {
        const noData = CODE.DATA(CODE.DB_CLOSE_ERROR);
        assert.equal(_.isUndefined(noData.data), true);
        const withData = CODE.DATA(CODE.DB_CLOSE_ERROR, { type : "nothing" });
        assert.equal(_.isUndefined(withData.data), false);
        const isOk = CODE.OK;
        assert.equal(isOk.code === 200 && _.isUndefined(isOk.data), true);
    });
});
