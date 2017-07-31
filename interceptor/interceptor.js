//TODO :유저 인증 체크
var auth = function(){
    return function(req,res,next){
        if(process.env.NODE_ENV == 'prod'){

        }else{
            req.session.userid = 'testAccount';
        }
        next();
    }
};

exports.init = function(app) {
   app.use(auth());
};

