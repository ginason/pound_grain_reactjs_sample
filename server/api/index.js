"use strict";


const fs  = require('graceful-fs');
const webpack = require('webpack');
const middlewareDev = require('webpack-dev-middleware');
const middlewareHot = require('webpack-hot-middleware');
const config = require('../../webpack.config');
const compiler = webpack(config);

const express   = require("express");
const http      = require("http");
const events    = require("events");
const app       = require("./app");
const routes    = require("./routes");
const schedules = require("./schedules");
const system    = require("../../system");


class API extends events.EventEmitter {
    constructor(name) {
        super();
        this.name   = name;
        this.server = null;
    }

    shutdown() {
        this.emit("shutdown");
    }

    start() {

        this.emit("start");
        console.log(schedules);
        const hashtags = new schedules.Hashtags();
        const fundings = new schedules.Fundings();
        // hashtags.start();
        // fundings.start();

        const self = this;  
        const val  = process.env.PORT || "3000";
        let port   = parseInt(val, 10);

        if (isNaN(port)) { port = val; }
        app.set("port", port);
        app.use(middlewareDev(compiler));
        if(process.env.NODE_ENV == 'development') {
            app.use(middlewareHot(compiler, {
                log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
            }));
        } else {
            app.use('/public', express.static("../../public", { maxAge: 30 }));
        }

        this.server = http.createServer(app);
        this.server.listen(port);
        this.server.on("error", function(error) {

            if (error.syscall !== "listen") { throw error; }

            const bind = "port " + app.get("port");
            switch (error.code) {
                case "EACCES":
                    system.debug(self.name, "error", "EACCESS", bind);
                    break;
                case "EADDRINUSE":
                    system.debug(self.name, "error", "EADDRINUSE", bind);
                    break;
            }
        });
        this.server.on("listening", function() {
            routes(app);
            let addr = self.server.address();
            self.emit("listening", addr.port);
        });

        const httpsOption = {
            key: fs.readFileSync('../../cert/sellev.com.key'),
            cert: fs.readFileSync('../../cert/sellev.com.crt'),
        };
        const https = require('https').createServer(httpsOption, app);
        https.listen(4443, () => {
            console.log('app.js :: app.listen :: Server Start on port number 4443');
        });

    }
}


module.exports = API;