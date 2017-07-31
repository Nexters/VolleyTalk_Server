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
 *     description: follow 하기
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
    var type = req.query.followTypes;
    var seq = req.query.followSeq;

    sequelize.transaction(function(t){
        return models.Follow.create({followtype: type, typeseq: seq, userid: userid}, {transaction: t})
            .then(function(follow){
                if(type == 'team'){
                    models.Team.findOne({attributes:['likecount'], where:{seq: seq}}).then(function(count){
                        return models.Team.update({likecount: count.dataValues.likecount+1}, {where: {seq:seq},returning: false}, {transaction: t});
                    });
                }else if(type == 'player'){

                }else if(type == 'user') {

                }
            });
    }).then(function (result){
        res.send('ok');
    }).catch(function (err){
        res.send('error');
    });
};