var sequelize, models;
var Q = require('Q');
var multer = require('multer');
exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};
var imagePath = "public/images";
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
 *         description: 포스트 타입(team, user)
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
      models.TeamPost.findAll({
          where: {teamseq: seq}, offset: start, limit: postCount
      }).then(function(teams){
          res.send(teams);
      });
  }else if(type == 'player'){
      models.PlayerPost.findAll({
          where: {teamseq: seq}, offset: start, limit: postCount
      }).then(function(players){
          res.send(players);
      });
  }
};

exports.postPost = function(req,res){

    upload(req, res).then(function (file) {
        res.json(file);
    }, function (err) {
        res.send(500, err);
    });
};

var upload = function (req, res) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
            //이미지파일 이름 설정
            //
        }
    });

    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err) deferred.reject();
        else {deferred.resolve(req.file);}
    });
    return deferred.promise;
};

//포스트 쓰기
//포스트 상세정보
//포스트 썸네일 리스트
//포스트 삭제