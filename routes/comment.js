var sequelize, models;
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment 관련 API
 */


/**
 * @swagger
 * /comment/apply:
 *   post:
 *     summary: 포스트에 코멘트 작성
 *     description: 포스트에 코멘트 작성
 *     tags: [Comment]
 *     parameters:
 *       - name: type
 *         description: 포스트 타입
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: postseq
 *         description: 포스트 seq
 *         in: formData
 *         type: int
 *         required: true
 *         defaultValue: 1
 *       - name: comment
 *         description: 코멘트 문구
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: 화이팅 코멘트
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: Success Comment apply success
 */
exports.commentApply = function(req,res){
    var data = {
        postseq: req.body.postseq,
        comment: req.body.comment,
        userid: req.cookies.userid
    };

    if(type == 'team'){
        models.TeamComment.create(data).then(function(response){
            util.success(res, response);
        });
    }else if(type == 'player') {
        models.PlayerComment.create(data).then(function(response){
            util.success(res, response);
        });
    }else{
        util.fail(res, "type error");
    }

};

/**
 * @swagger
 * /comment/list:
 *   get:
 *     summary: 프스트 댓글 리스트
 *     description: 포스트 댓글 리스트
 *     tags: [Comment]
 *     parameters:
 *       - name: type
 *         description: 포스트 타입(team, player)
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: seq
 *         description: 포스트 seq
 *         in: query
 *         type: integer
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Post comments list
 */
exports.getCommentList = function(req, res){
    var userid = req.cookies.userid;
    var type = req.query.type;
    var seq  = req.query.seq;

    if(type == 'team'){
        models.TeamComment.findAll({
            where: {postseq: seq},
            include: [{model: models.User, as: 'user', attributes: ['nickname','profileimg_thumb'], where: {userid: userid}, required: false}]
        }).then(function(commentList){
            util.success(res, commentList);
        });
    }else if(type == 'player'){
        models.PlayerComment.findAll({
            where: {postseq: seq},
            include: [{model: models.User, as: 'user', attributes: ['nickname','profileimg_thumb'], where: {userid: userid}, required: false}]
        }).then(function(commentList){
            util.success(res, commentList);
        });
    }else{
        util.fail(res, "type error");
    }
};

/**
 * @swagger
 * /comment/delete:
 *   post:
 *     summary: 코멘트 삭제
 *     description: 코멘트 삭제
 *     tags: [Comment]
 *     parameters:
 *       - name: type
 *         description: 포스트 타입
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: seq
 *         description: 코멘트 seq
 *         in: formData
 *         type: integer
 *         required: true
 *         defaultValue: 1
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: Success Comment delete success
 */
exports.deleteComment = function(req,res){
    var userid = req.cookies.userid;
    var type = req.body.type;
    var seq  = req.body.seq;

    console.log(type);

    if(type == 'team'){
        models.TeamComment.destroy({
            where: {userid: userid, seq: seq}
        }).then(function(desResult){
            util.success(res, desResult);
        }).catch(function(err){
            util.fail(res, err.message);
        });
    }else if(type == 'player') {
        models.PlayerComment.destroy({
            where: {userid: userid, seq: seq}
        }).then(function(desResult){
            util.success(res, desResult);
        }).catch(function(err){
            util.fail(res, err.message);
        });
    }
};