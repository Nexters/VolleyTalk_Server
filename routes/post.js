var sequelize, models;
var Q = require('q');
var multer = require('multer');
var path = require('path');
var gm = require('gm');
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post 관련 API
 */

/**
 * @swagger
 * /post/list:
 *   get:
 *     summary: 포스트 목록 가져오기
 *     description: 포스트 목록 가져오기
 *     tags: [Post]
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
 *         type: int
 *         required: true
 *         defaultValue: 1
 *       - name: start
 *         description: 포스트 시작번호
 *         in: query
 *         type: int
 *         required: true
 *         defaultValue: 1
 *       - name: postCount
 *         description: 가져올 포스트 갯수(start기준으로 몇개 가져올건지
 *         in: query
 *         type: int
 *         required: true
 *         defaultValue: 10
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Post List
 */
exports.getPostList = function(req, res){
  var type = req.params.type; //team, user;
  var seq  = req.params.seq;
  var start= req.params.start;
  var postCount  = req.params.postCount;

  if(type == 'team'){
      models.TeamPost.findAll({where: {teamseq: seq}, offset: start, limit: postCount}).then(function(teams){
          util.success(res, teams);
      });
  }else if(type == 'player'){
      models.PlayerPost.findAll({where: {teamseq: seq}, offset: start, limit: postCount}).then(function(players){
          util.success(res. players);s
      });
  }
};


/**
 * @swagger
 * /post/apply:
 *   post:
 *     summary: 포스트 작성
 *     description: 포스트 작성
 *     tags: [Post]
 *     parameters:
 *       - name: file
 *         description: 이미지 파일
 *         in: formData
 *         type: file
 *         required: false
 *       - name: type
 *         description: 포스트 타입(team, player)
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: seq
 *         description: 포스트 seq
 *         in: formData
 *         type: int
 *         required: true
 *         defaultValue: 1
 *       - name: title
 *         description: 포스트 타이틀
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: this is title
 *       - name: contents
 *         description: 포스트 컨텐츠
 *         in: formData
 *         type: string
 *         required: true
 *         defaultValue: this is content
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: Success Post post
 */

exports.postPost = function(req,res){
    upload(req, res).then(function (file) {
        var seq = req.body.seq;
        var model = {
            type: req.body.type,
            title: req.body.title,
            contents: req.body.contents,
            userid: req.cookies.userid
        };

        if(file != null) {
            var thumbnail = file.path.replace('_','_thumb_');
            model.img_url = file.path;
            model.img_url_thumb = thumbnail;
            gm(file.path).thumb(200,200, thumbnail, function(err){
                if(err) console.log(err);
                else {
                    console.log('thumbnail create done : ' + thumbnail);
                }
            });
        }

        //Todo: 트랜잭션 걸기
        if(model.type == 'team'){
            model.teamseq = seq;
            models.TeamPost.create(
                model
            ).then(function(response){
                return models.Team.findOne({attributes:['postcount'], where:{seq: seq}}).then(function(count) {
                    return models.Team.update({postcount: count.dataValues.postcount + 1}, {
                        where: {seq: seq}, returning: false}).then(function(response){
                            console.log('team '+ response);
                    });
                });
            });
        }else if(model.type == 'player'){
            model.playerseq = seq;
            models.PlayerPost.create(
                model
            ).then(function(response){
                return models.Player.findOne({attributes:['postcount'], where:{seq: seq}}).then(function(count) {
                    return models.Player.update({postcount: count.dataValues.postcount + 1}, {
                        where: {seq: seq}, returning: false}).then(function(response){
                        console.log('player '+ response);
                    });
                });
            });
        }else{
            util.fail(res, "type error");
        }
        if(file != null) {
            file.thumbnail = thumbnail;
            util.success(res, file);
        }else{
            util.success(res,{status:'success'});
        }
    }, function (err) {
        util.fail(res, err.message);
    });
};

var upload = function (req, res) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'img/');
        },
        filename: function (req, file, cb) {
            var time = new Date().valueOf();
            var imageUrl = 'img_'+time + path.extname(file.originalname);
            cb(null, imageUrl);
        }
    });

    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err){
            deferred.reject();
        }else {
            deferred.resolve(req.file);
        }
    });
    return deferred.promise;
};

/**
 * @swagger
 * /post/img/list:
 *   get:
 *     summary: 갤러리 가져오기
 *     description: 갤러리 가져오기
 *     tags: [Post]
 *     parameters:
 *       - name: type
 *         description: 포스트 타입(team, player)
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: team
 *       - name: start
 *         description: 포스트 시작번호
 *         in: query
 *         type: int
 *         required: true
 *         defaultValue: 1
 *       - name: imgCount
 *         description: 가져올 이미지 갯수(start기준으로 몇개 가져올건지)
 *         in: query
 *         type: int
 *         required: true
 *         defaultValue: 10
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get Post img List
 */
exports.getImgList = function(req, res){
    var type = req.query.type;
    var start= req.params.start;
    var imgCount  = req.params.imgCount;

    if(type == 'team'){
        models.TeamPost.findAll({attributes:['seq','img_url_thumb'], where:{img_url_thumb: {$ne: null}}, offset: start, limit: imgCount}).then(function(imgList){
            util.success(res, imgList);
        });
    }else if(type == 'player'){
        models.PlayerPost.findAll({attributes:['seq','img_url_thumb'],  where:{img_url_thumb: {$ne: null}}, offset: start, limit: imgCount}).then(function(imgList){
            util.success(res, imgList);
        });
    }else{
        util.fail(res, "type error");
    }
};

//포스트 삭제