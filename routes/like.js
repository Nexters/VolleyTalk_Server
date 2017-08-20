var sequelize, models;
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: Like 관련 API
 */

/**
 * @swagger
 * /like/list:
 *   get:
 *     summary: 해당 유저의 like 리스트
 *     description: 해당 유저의 like 리스트
 *     tags: [Like]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Like List
 */
exports.getLikeList = function(req,res){
    var userid = req.cookies.userid;

    models.Like.findAll({
        where: {userid: userid}
    }).then(function(likes){
        util.success(res, likes);
    });
};

/**
 * @swagger
 * /like/apply:
 *   post:
 *     summary: like 하기 / 취소하기
 *     description: like 하기 / 취소하기
 *     tags: [Like]
 *     parameters:
 *       - name: likeTypes
 *         description: 좋아요 타입(user, team, player, teampost, playerpost)
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: user
 *       - name: likeSeq
 *         description: 좋아요 seq
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success post like
 */
exports.postLikePreCheck = function(req,res, next) {
    var userid = req.cookies.userid;
    var type = req.query.likeTypes.toLowerCase();
    var seq = req.query.likeSeq;

    //본인이 본인 라이크 하는지 체크
    if (type == 'user') {
        models.User.findOne({attributes: ['seq'], where: {userid: userid}}).then(function (userSeq) {
            if (userSeq.dataValues.seq == seq) {
                util.fail(res, "You can't like yourself");
            } else {
                models.User.findOne({attributes: ['seq'], where: {seq: seq}}).then(function (userSeq2) {
                    if(userSeq2 == null){
                        util.fail(res, "Not Exist User");
                    }else {
                        next();
                    }
                });
            }
        });
    }else{
        next();
    }
};

exports.postLike = function(req, res) {

    var userid = req.cookies.userid;
    var type = req.query.likeTypes.toLowerCase();
    var seq = req.query.likeSeq;
    var data = {liketype: type, typeseq: seq, userid: userid};

    sequelize.transaction(function(t){
        return models.Like.count({where: data}, {transaction: t})
            .then(function (like) {
                if(like >= 1){ // 라이크를 이미 한 상태 -> 라이크 취소
                    return models.Like.destroy({where: data}, {transaction: t})
                        .then(function(like){
                            if(type == 'user'){
                                //상대방의 팔로우 카운트를 가져온다
                                return models.User.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    //상대방의 카운트가 0이 아니면
                                    if(count.dataValues.likecount != 0) {
                                        //-1을 한다
                                        return models.User.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return {"result" : true};
                                        });
                                    }
                                });
                            }else if(type == 'team'){
                                models.Team.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.likecount != 0) {
                                        return models.Team.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return {"result" : true};
                                        });
                                    }
                                });
                            }else if(type == 'player'){
                                models.Player.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.likecount != 0) {
                                        return models.Player.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return {"result" : true};
                                        });
                                    }
                                });
                            }else if(type == 'teampost'){
                                models.TeamPost.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.likecount != 0) {
                                        return models.TeamPost.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return {"result" : true};
                                        });
                                    }
                                });
                            }else if(type == 'playerpost'){
                                models.PlayerPost.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.likecount != 0) {
                                        return models.PlayerPost.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return {"result" : true};
                                        });
                                    }
                                });
                            }
                        });
                }else{// 아직 팔로우를 안한상태 -> 팔로우
                    return models.Like.create(data, {transaction: t})
                        .then(function(like){
                            if(type == 'user'){
                                models.User.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    return models.User.update({likecount: count.dataValues.likecount + 1}, {
                                        where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                        return updateRes;
                                    });
                                });
                            }else if(type == 'team'){
                                models.Team.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    return models.Team.update({likecount: count.dataValues.likecount + 1}, {
                                        where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                        return updateRes;
                                    });
                                });
                            }else if(type == 'player'){
                                models.Player.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    return models.Player.update({likecount: count.dataValues.likecount + 1}, {
                                        where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                        return updateRes;
                                    });
                                });
                            }else if(type == 'teampost'){
                                models.TeamPost.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    return models.TeamPost.update({likecount: count.dataValues.likecount + 1}, {
                                        where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                        return updateRes;
                                    });
                                });
                            }else if(type == 'playerpost'){
                                models.PlayerPost.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    return models.PlayerPost.update({likecount: count.dataValues.likecount + 1}, {
                                        where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                        return updateRes;
                                    });
                                });
                            }
                            return like;
                        });
                }
            })
    }).then(function (result){
        util.success(res, result);
    }).catch(function (err){
        util.fail(res, err.message);
    });
};
