var sequelize, models;
var _ = require('underscore');
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Player
 *   description: Player 관련 API
 */

/**
 * @swagger
 * /player/list/{gender}:
 *   get:
 *     summary:
 *     description: 선수정보를 리스트로 넘겨줌
 *     tags: [Player]
 *     parameters:
 *       - name: gender
 *         description: 성별 (M/F)
 *         in: path
 *         type: string
 *         required: true
 *         defaultValue: M
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Player List
 */
exports.getPlayerList = function(req, res){
    var gender = req.params.gender;
    var userid = req.session.userid;

    models.Player.findAll({
        attributes: ['seq','teamseq','backnumber','name','physical','likecount','postcount'],
        where: {gender: gender},
        include: [{model: models.Like, as: 'like', attributes: ['seq'], where: {liketype: 'player', userid: userid}, required: false},
                  {model: models.Follow, as: 'follow', attributes: ['seq'], where: {followtype: 'player', userid: userid}, required: false}]
    }).then(function(players){
        var groupBy = _.groupBy(players,'teamseq');
        var result = [];

        for( var key in groupBy ) {
            var tmp = {};
            tmp.team = key;
            tmp.player = groupBy[key];
            result.push(tmp);
        }
        util.success(res, result);
    }).catch(function(err){
        util.fail(res, "서버에서 오류가 발생했습니다.");
    });
};

/**
 * @swagger
 * /player/info/{playerseq}:
 *   get:
 *     summary:
 *     description: 선수정보를 넘겨줌
 *     tags: [Player]
 *     parameters:
 *       - name: playerseq
 *         description: 선수 seq
 *         in: path
 *         type: string
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Player infomation
 */
exports.getPlayerInfo = function(req,res){
    var playerseq = req.params.playerseq;
    var userid = req.session.userid;

    models.Player.findOne({
        attributes: ['seq','teamseq','backnumber','name','physical','likecount','postcount'],
        where: {seq: playerseq},
        include: [{model: models.Like, as: 'like', attributes: ['seq'], where: {liketype: 'player', userid: userid}, required: false},
                  {model: models.Follow, as: 'follow', attributes: ['seq'], where: {followtype: 'player', userid: userid}, required: false}]
    }).then(function(player){
        util.success(res, player);
    }).catch(function(err){
        util.fail(res, "서버에서 오류가 발생했습니다.");
    });
};
