"use strict";

module.exports = function(app) {
    app.use(function(req, res, next) {
        next();
    });

    app.use("/account/auth/login", require("./account/auth/login"));
    app.use("/account/auth/session", require("./account/auth/session"));
    app.use("/account/auth/signup", require("./account/auth/signup"));
    app.use("/account/auth/setting", require("./account/auth/setting"));    
    app.use("/account/auth/verification", require("./account/auth/verification"));

    app.use("/account/follow/follower", require("./account/follow/follower"));
    app.use("/account/follow/following", require("./account/follow/following"));

    app.use("/account/user", require("./account/user/users"));

    app.use("/product/cart", require("./product/cart"));
    app.use("/product/like", require("./product/like"));
    app.use("/product", require("./product/products"));

    app.use("/banner", require("./banner/banner"));
    app.use("/comment", require("./comment/comment"));
    app.use("/notification", require("./notification/notification"));
    app.use("/hashtag", require("./hashtag/hashtags"));

    app.use("/payment/delivery", require("./payment/delivery"));
    app.use("/payment/invoice", require("./payment/invoice"));
    app.use("/payment/iamport", require("./payment/iamport"));
    app.use("/payment/order", require("./payment/order"));

    app.use("/search", require("./search/search"));

    app.use("/media", require("./media"));
    app.use("/statistic", require("./statistic/statistic"));
    app.use("/temp", require("./temp/temp"));

    require('./popup/popup')(app);
    require('./view')(app);
    require("./error")(app);
};