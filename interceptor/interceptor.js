var util = require('../util/util');

var auth = function () {
    return function (req, res, next) {
        if(req.cookies.userid != null) {
            next();
        }else{
            util.fail(res, "인증에 실패했습니다");
        }
    }
};

exports.init = function (app) {
    app.use(auth());
};

