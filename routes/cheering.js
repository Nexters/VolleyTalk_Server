var sequelize, models;
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Cheering
 *   description: Cheering 관련 API
 */

/**
 * @swagger
 * /cheering/apply:
 *   post:
 *     summary: 응원 문구 작성
 *     description: 응원 문구 작성
 *     tags: [Cheering]
 *     parameters:
 *       - name: playerseq
 *         description: 선수 seq
 *         in: formData
 *         type: integer
 *         required: true
 *         defaultValue: 1
 *       - name: comment
 *         description: 응원 코멘트
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: 화이팅
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: Success Cheering apply success
 */
exports.cheeringApply = function(req,res){
    var data = {
        playerseq: req.body.playerseq,
        comment: req.body.comment,
        userid: req.cookies.userid
    };

    models.Cheering.create(data).then(function(response){
       console.log(response);
       res.send('ok');
    });
};

/**
 * @swagger
 * /cheering/list:
 *   get:
 *     summary: 선수 응원 정보 리스트
 *     description: 선수 응원 정보 리스트
 *     tags: [Cheering]
 *     parameters:
 *       - name: playerseq
 *         description: 선수 seq
 *         in: query
 *         type: integer
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Player Cheering list
 */
exports.cheeringList = function(req, res){
    var playerseq = req.query.playerseq;
    var userid = req.cookies.userid;

    models.Cheering.findAll({
        where:{playerseq: playerseq},
        include: [{model: models.User, as: 'user', attributes: ['nickname','profileimg_thumb'], where: {userid: userid}, required: false}]
    }).then(function(list){
       util.success(res, list);
    });
};