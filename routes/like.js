var sequelize, models;

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
 *     summary:
 *     description: 해당 유저의 like 리스트
 *     tags: [Like]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Like List
 */
exports.getLikeList = function(req,res){
    var userid = req.session.userid;

    models.Like.findAll({
        where: {userid: 'userid'}
    }).then(function(likes){
        res.send(likes);
    })
};

/**
 * @swagger
 * /like/apply:
 *   post:
 *     summary:
 *     description: like 하기 / 취소하기
 *     tags: [Like]
 *     parameters:
 *       - name: likeTypes
 *         description: 좋아요 타입
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
exports.postLike = function(req,res){
    var userid = req.session.userid;
    var type = req.query.likeTypes.toLowerCase();
    var seq = req.query.likeSeq;

    var where = {where: {followtype: type, typeseq: seq, userid: userid}};
    var mySeq;
    //본인이 본인 라이크 하는지 체크
    if(type == 'user'){
        models.User.findOne({attributes:['seq'], where:{userid: userid}}).then(function(userSeq){
            if(userSeq.dataValues.seq == seq){
                res.send("You can't like yourself");
            }else{
                mySeq = userSeq.dataValues.seq;
            }
        });
    }

    sequelize.transaction(function(t){
        return models.Like.count(where, {transaction: t})
            .then(function (like) {
                if(like >= 1){ // 라이크를 이미 한 상태 -> 라이크 취소
                    return models.Like.destroy(where, {transaction: t})
                        .then(function(like){
                            if(type == 'user'){

                                //상대방의 팔로우 카운트를 가져온다
                                return models.User.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    //상대방의 카운트가 0이 아니면
                                    if(count.dataValues.likecount != 0) {
                                        //-1을 한다
                                        return models.User.update({likecount: count.dataValues.likecount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return true;
                                        });
                                    }
                                });
                            }else if(type == 'team'){

                            }else if(type == 'player'){

                            }else if(type == 'post'){

                            }
                            return true;
                        });
                }else{           // 아직 팔로우를 안한상태 -> 팔로우
                    return models.Like.create(where, {transaction: t})
                        .then(function(follow){
                            if(type == 'user'){
                                models.User.findOne({attributes:['likecount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.likecount != 0) {
                                        return models.User.update({likecount: count.dataValues.likecount + 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                            return true;
                                        });
                                    }
                                });
                            }else if(type == 'team'){

                            }else if(type == 'player'){

                            }else if(type == 'post'){

                            }
                            return true;
                        });
                }
            })
    }).then(function (result){
        res.send('ok');
    }).catch(function (err){
        res.send('error');
    });
};
