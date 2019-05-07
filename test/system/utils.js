"use strict";


const assert  = require("assert");
const _       = require("underscore");
const CODE    = require("../../system/code");
const pnumber = require("../../system/phonenumber");
const system  = require("../../system");
const utils   = require("../../server/api/utils");


describe("Middle Utility Test", function() {
   
    it("null, undefined, NaN should be changed to default", function() {
        assert.equal(system.ensure(null, 0) === 0, true);
        assert.equal(system.ensure(null, 1) === 1, true);
        assert.equal(system.ensure(undefined, 1) === 1, true);
        assert.equal(system.ensure(undefined, 2) === 2, true);
        assert.equal(system.ensure(NaN, 2) === 2, true);
        assert.equal(system.ensure(NaN, 3) === 3, true);
    });

    it("no (null, undefined, NaN) should not be changed to default", function() {
        assert.equal(system.ensure(10, 0) === 10, true);
        assert.equal(system.ensure(10, 1) === 10, true);
        assert.equal(typeof(system.ensure("string", 1)), "string");
    });    


    it("no (null, undefined, NaN) should not be changed to default", function() {
        assert.equal(system.boolean(1), true);
        assert.equal(system.boolean(0), false);
        assert.equal(system.boolean(-1), false);
        assert.equal(system.boolean(10), true);

        assert.equal(system.boolean(true), true);
        assert.equal(system.boolean(false), false);
        assert.equal(system.boolean("true"), true);
        assert.equal(system.boolean("false"), false);
        assert.equal(system.boolean("trueee"), false);
        assert.equal(system.boolean("falseee"), false);
        assert.equal(system.boolean(null), false);
        assert.equal(system.boolean(undefined), false);
    });        
});