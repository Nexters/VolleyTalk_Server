exports.success = function(res, data){
    res.json({status: true, resData: data});
};

exports.fail = function(res, msg){
    res.json({status: false, errMsg: msg});
};