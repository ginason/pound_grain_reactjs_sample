"use strict";


const _               = require("underscore");
const logger          = require("./logger");
module.exports.C      = require("./code");
module.exports.E      = require("./error");


module.exports.logger = logger;
module.exports.info   = logger.info;
module.exports.debug  = logger.debug;
module.exports.error  = logger.error;



module.exports.ensureNull = function(value) {
    if(_.isUndefined(value)) {
        value = null;
    }
    return value;
};


module.exports.ensure = function(value, def) {

    if(_.isNull(value) || _.isUndefined(value) || Number.isNaN(value)) {
        value = def;
    }
    return value;
};


module.exports.boolean = function(value) {

    if(_.isUndefined(value)) {
        return false;
    }

    if(_.isBoolean(value)) {
        return value;
    }

    if(_.isString(value)) {
        if(value === "false") { return false; }
        if(value === "true") { return true; }
        return false;
    }

    if(_.isNumber(value)) {
        return (value > 0);
    }
    return false;
};
