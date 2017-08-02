var sequelize, models;

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow 관련 API
 */

/**
 * @swagger
 * /follow/list:
 *   get:
 *     summary:
 *     description: 해당 유저의 follow 리스트
 *     tags: [Follow]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Follow List
 */
exports.getFollowList = function(req,res){
    var userid = req.session.userid;

    models.Follow.findAll({
        where: {userid: 'userid'}
    }).then(function(follows){
        res.send(follows);
    })
};


/**
 * @swagger
 * /follow/apply:
 *   post:
 *     summary:
 *     description: follow 하기 / 취소하기
 *     tags: [Follow]
 *     parameters:
 *       - name: followTypes
 *         description: 팔로우 타입
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: followSeq
 *         description: 팔로우 seq
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success post Follow
 */
exports.postFollow = function(req,res){
    var userid = req.session.userid;
    var type = req.query.followTypes.toLowerCase();
    var seq = req.query.followSeq;

    var where = {where: {followtype: type, typeseq: seq, userid: userid}};
    var mySeq;
    //본인이 본인 팔로우 하는지 체크
    if(type == 'user'){
        models.User.findOne({attributes:['seq'], where:{userid: userid}}).then(function(userSeq){
            if(userSeq.dataValues.seq == seq){
                res.send("You can't follow yourself");
            }else{
                mySeq = userSeq.dataValues.seq;
            }
        });
    }

    sequelize.transaction(function(t){
        //Todo: 내가 다른 유저를 팔로우 하면 -> 나는 팔로잉 카운트가, 상대방은 팔로워 카운트가 증가해야함.
        return models.Follow.count(where, {transaction: t})
            .then(function (follow) {
                if(follow >= 1){ // 팔로우를 이미 한 상태 -> 팔로우 취소
                    return models.Follow.destroy(where, {transaction: t})
                        .then(function(follow){
                            if(type == 'user'){

                                //상대방의 팔로우 카운트를 가져온다
                                return models.User.findOne({attributes:['followercount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    //상대방의 카운트가 0이 아니면
                                    if(count.dataValues.followercount != 0) {
                                        //-1을 한다
                                        return models.User.update({followercount: count.dataValues.followercount - 1}, {
                                            where: {seq: seq}, returning: false}, {transaction: t}).then(function(updateRes){
                                                return models.User.findOne({attributes:['followingcount'], where:{seq:mySeq}}, {transaction: t}).then(function(count){
                                                    return models.User.update({followingcount: count.dataValues.followingcount - 1}, {
                                                        where: {seq: myseq}, returning: false}, {transaction: t}).then(function(updateRes){
                                                        return true;
                                                    });
                                                });
                                        });
                                    }
                                });
                            }
                            return true;
                        });
                }else{           // 아직 팔로우를 안한상태 -> 팔로우
                    return models.Follow.create(where, {transaction: t})
                        .then(function(follow){
                            if(type == 'user'){
                                models.User.findOne({attributes:['followercount'], where:{seq: seq}}, {transaction: t}).then(function(count){
                                    if(count.dataValues.followercount != 0) {
                                        return models.User.update({followercount: count.dataValues.followercount + 1}, {
                                            where: {seq: seq},
                                            returning: false
                                        }, {transaction: t}).then(function(updateRes){
                                            return models.User.findOne({attributes:['followingcount'], where:{seq:mySeq}}, {transaction: t}).then(function(count){
                                                return models.User.update({followingcount: count.dataValues.followingcount + 1}, {
                                                    where: {seq: myseq}, returning: false}, {transaction: t}).then(function(updateRes){
                                                    return true;
                                                });
                                            });
                                        });
                                    }
                                });
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