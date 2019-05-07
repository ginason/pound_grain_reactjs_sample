"use strict";


const express  = require("express");
const geoip    = require("geoip-lite");
const path         = require("path");
const fs = require('fs');
const ejs = require('ejs');
const system   = require("../../../system");

// Config
const con = require("../../../env/const.json");

const E = system.E;
const C = system.C;


module.exports = function(app) {
    app.route('/payment/iamport').get(payment);
    app.route('/payment/iamport/result').get(paymentResult);
    app.route('/admin').get(admin);
    app.route('/admin/*').get(admin);
    app.route('/').get(home);
    app.route('/*').get(home);
};

function home (req, res, next) {
    var meta = {
        title: con.live.META_TITLE,
        description: con.live.META_DESCRIPTION,
        keywords: con.live.META_KEYWORD,
        image: con.live.META_IMAGE,
        url: con.live.DOMAIN,
    };
    var file = fs.readFileSync(path.join(__dirname + "../../../../public/Sellev/index.ejs"), 'utf-8');
    var rendered = ejs.render(file, {
        meta: meta,
        author: req.user || null
    });
    res.send(rendered);
}

function admin (req, res, next) {
    var meta = {
        title: con.live.META_TITLE,
        description: con.live.META_DESCRIPTION,
        keywords: con.live.META_KEYWORD,
        image: con.live.META_IMAGE,
        url: con.live.DOMAIN,
    };
    var file = fs.readFileSync("../../public/Admin/index.ejs", 'utf-8');
    var rendered = ejs.render(file, {
        meta: meta,
        author: req.user || null
    });
    res.send(rendered);
}

function payment (req, res, next) {
    var file = fs.readFileSync("../../public/Payment/index.ejs", 'utf-8');
    var rendered = ejs.render(file);
    res.send(rendered);
}
function paymentResult (req, res, next) {
    var file = fs.readFileSync("../../public/Payment/result.ejs", 'utf-8');
    var rendered = ejs.render(file);
    res.send(rendered);
}