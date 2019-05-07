"use strict";


const API    = require("../api");
const system = require("../../system");


(function() {
    const _api = new API("api");

    _api.on("start", function() {
        system.debug(this.name, "start");
    });

    _api.on("shutdown", function() {
        system.debug(this.name, "shutdown");
    });

    _api.on("error", function(err) {
        system.debug(this.name, "error");
    });

    _api.on("listening", function(port) {
        system.debug(this.name, "listening", port);
    });

    _api.start();

    const _exit = function() {
        if(_api) { _api.shutdown(); }
        process.exit(0);
    };

    process.on("SIGHUP", function() {
        system.debug(this.name, "SIGHUP");
        _exit();
    });

    process.on("SIGINT", function() {
        system.debug(this.name, "SIGINT");
        _exit();
    });

    process.on("SIGTERM", function() {
        system.debug(this.name, "SIGTERM");
        _exit();
    });
}());