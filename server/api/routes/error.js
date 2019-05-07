"use strict";


module.exports = function(app) {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {

        res.status(err.status || 500);
        res.json({
            message : err.message,
            error   : {}
        });
    });
};