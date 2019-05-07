export default {
    url: '',

    /////////////// Authentification /////////////
    GET_AUTH_VERIFICATION_CODE: '',
    GET_AUTH_IS_ID_DUPLICATED: '',
    GET_AUTH_SESSION: '/account/auth/session',

    POST_AUTH_LOGIN: '/account/auth/login',
    POST_AUTH_LOGIN_KAKAO: '',
    POST_AUTH_LOGIN_FACEBOOK: '',
    POST_AUTH_LOGIN_NAVER: '',
    POST_AUTH_LOGOUT: '/account/auth/session/logout',
    POST_AUTH_SIGNUP: '/account/auth/signup',
    POST_AUTH_IS_EXIST: '/account/auth/signup/existence',
    POST_AUTH_SIGNUP_EXISTENCE: '/account/auth/signup/existence',
    POST_UPDATE_PROFILE: '/account/auth/setting/update',
    POST_AUTH_VERIFY_PHONENUMBER: '/account/auth/verification/phoneNumber',
    POST_AUTH_CHANGE_PASSWORD: '/account/auth/setting/changepassword/byOldPassword',
    POST_AUTH_CHANGE_PASSWORD_BYPHONENUMBER: '/account/auth/setting/changepassword/byPhoneNumberVerification',
    POST_AUTH_VERIFY_PASSWORD: '/account/auth/verification/password',


    /////////////// Product (Product) ///////////////////////
    GET_PRODUCT_LIST: '/product/list',
    GET_PRODUCT_ONE: '/product/one/:productId',
    GET_PRODUCT_COUNT: '/product/count',

    POST_PRODUCT_LIKE: '/product/like/update',
    POST_PRODUCT_INCREASE_HIT: '/product/hit/increase',

    /////////////// Banner ////////////////////////
    GET_BANNER_LIST: '/banner/list',

    /////////////// Notification ////////////////////////
    GET_NOTIFICATION_LIST: '/notification/list',

    POST_NOTIFICATION_UPDATE: '/notification/update',

    /////////////// HashTag ///////////////////////
    GET_HASHTAG_LIST: '/hashtag/list',
    GET_HASHTAG_COUNT: '/hashtag/list/count',
    GET_HASHTAG_ONE: '/hashtag/:hashtagId',

    POST_HASHTAG_LIKE: '/hashtag/:hashtagId/like',
    POST_HASHTAG_INCREASE_HIT: '/hashtag/hit/increase',

    /////////////// Comments //////////////////////
    GET_COMMENT_LIST: '/comment/:productId/list',
    GET_COMMENT_LIKE: '/comment/:productId/like',
    GET_COMMENT_COUNT: '/comment/:productId/count',

    POST_COMMENT_UPDATE: '/comment/update',
    POST_COMMENT_LIKE: '/comment/:commentId/like',

    /////////////// Users //////////////////////
    GET_USER_COUNT: '/account/user/count',
    GET_USER_LIST: '/account/user/list',
    GET_USER_PRIORITY: '/account/user/priority',
    GET_USER_PRIORITY_COUNT: '/account/user/priority/count',
    GET_FOLLOWER_LIST: '/account/follow/follower/:userId',
    GET_FOLLOWING_LIST: '/account/follow/following/:userId',

    POST_FOLLOW_USER: '/account/follow/following',

    //////////////// FileUpload //////////////////////
    UPLOAD_IMAGE: '/media/image',

    ///////////////Payment ////////////////////////////
    GET_INVOICE_LIST: '/payment/invoice/list',
    GET_INVOICE_COUNT: '/payment/invoice/count',
    GET_DELIVERY: '/payment/delivery',
    GET_DELIVERY_DEFAULT: '/payment/delivery/default',
    GET_ORDER_LIST: '/payment/order/product/list',

    POST_CREATE_INVOICE: '/payment/invoice/create',
    POST_DELIVERY_UPDATE: '/payment/delivery/update',

    ///////////////ProductCart ////////////////////////////
    GET_CART_LIST: '/product/cart/list',
    POST_CREATE_CART: '/product/cart/create',
    POST_DELETE_CART: '/product/cart/delete',

    //////////////// Search //////////////////////
    GET_TOP_SEARCH: '/search/topSearchQueries',
};
