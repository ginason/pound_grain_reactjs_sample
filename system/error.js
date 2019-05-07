"use strict";


class AbstractError extends Error {

    constructor(value) {

        super();        
        this.name       = "AbstractError";
        this.errorLevel = "error";
        this.value      = value;
        if(!value) { return; }
        this.code       = value.code;
        this.message    = value.message;
        this.data       = value.data;
    }
}


class DBError extends AbstractError {

    constructor(value) {
        super(value);
        this.name = "DBError";
    }
}


class SystemError extends AbstractError {
    
    constructor(value) {
        super(value);
        this.name = "SystemError";
    }
}


module.exports.AbstractError = AbstractError;
module.exports.SystemError   = SystemError;
module.exports.DBError       = DBError;

