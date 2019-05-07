"use strict";


const assert = require("assert");
const _      = require("underscore");
const ERROR  = require("../../system/error");


describe("Error Class", function() {
    describe("Relation between Error Classes", function() {
        it("DBError is instance of AbstractError", function() {
            const dberror = new ERROR.DBError();
            assert.equal(dberror instanceof ERROR.AbstractError, true);
        });

        it("SystemError should be instance of AbstractError ", function() {
            const serror = new ERROR.SystemError();
            assert.equal(serror instanceof ERROR.AbstractError, true);
        });

        it("DBError shoule not be instance of SystemError", function() {
            
            const serror = new ERROR.SystemError(); 
            assert.equal(serror instanceof ERROR.DBError, false);
        });

        it("SystemError should not be instance of DBError", function() {
            
            const dberror = new ERROR.DBError();
            assert.equal(dberror instanceof ERROR.SystemError, false);
        });
    });

    describe("Error Class Name Check", function() {
        it("DBError name should bo 'DBError'", function() {
            const dberror = new ERROR.DBError();
            assert.equal(dberror.name === "DBError", true);
        });

        it("SystemError name should bo 'SystemError'", function() {
            const sberror = new ERROR.SystemError();
            assert.equal(sberror.name === "SystemError", true);
        });

        it("AbstractError name should bo 'AbstractError'", function() {
            const aberror = new ERROR.AbstractError();
            assert.equal(aberror.name === "AbstractError", true);
        });
    });
});
