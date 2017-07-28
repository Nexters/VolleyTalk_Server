//TODO :유저 인증 체크
var auth = function(){
    return function(req,res,next){
        //var userid = req.cookies.userid;
        next();
    }
};

exports.init = function(app) {
   app.use(auth());
};

