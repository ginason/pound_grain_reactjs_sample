"use strict";


const express      = require("express");
const path         = require("path");
const favicon      = require("serve-favicon");
const logger       = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser   = require("body-parser");
const compression  = require("compression");


const app = express();
app.use(compression());


// view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/public"));
app.set("view engine", "ejs");
app.set("trust proxy", true);
app.disable("x-powered-by");


require("./utils/session").init(app);
app.use(logger("dev"));

app.use(bodyParser.json({ limit : "100mb" }));
app.use(bodyParser.urlencoded({ limit : "100mb", extended : true }));
app.use(cookieParser());

// Static files
app.use('/assets', express.static('../../public/Assets', { maxAge: 30 }));
app.use('/node_modules', express.static('../../node_modules', { maxAge: 30 }));

// 임시 코드
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

module.exports = app;