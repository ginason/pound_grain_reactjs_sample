"use strict";


const assert = require("assert");
const _      = require("underscore");
const config = require("../../env");


describe("Config Property", function() {
   
    it("db config shuould have properties", function() {

        process.env.NODE_ENV = "development";
        const ddb = config.db();
        assert.equal(ddb && _.has(ddb, "port") && _.has(ddb, "host") && 
            _.has(ddb, "user") && _.has(ddb, "password") && _.has(ddb, "database"), true);

        process.env.NODE_ENV = "production";
        const pdb = config.db();
        assert.equal(pdb && _.has(pdb, "port") && _.has(pdb, "host") && 
            _.has(pdb, "user") && _.has(pdb, "password") && _.has(pdb, "database"), true);
    });

    it("aws config shuould have properties", function() {

        process.env.NODE_ENV = "development";
        const daws = config.aws();
        assert.equal(daws && _.has(daws, "accessKeyId") && _.has(daws, "secretAccessKey") && _.has(daws, "region"), true);

        process.env.NODE_ENV = "production";
        const paws = config.aws();
        assert.equal(paws && _.has(paws, "accessKeyId") && _.has(paws, "secretAccessKey") && _.has(paws, "region"), true);

        process.env.NODE_ENV = "strange env";
        const saws = config.aws();
        assert.equal(_.isEqual(daws, saws), true);

        process.env.NODE_ENV = undefined;
    });
});
