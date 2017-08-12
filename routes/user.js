var sequelize, models;
var util = require('../util/util');

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User 관련 API
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입 하기
 *     tags: [User]
 *     parameters:
 *       - name: userid
 *         description: 사용자 카카오 번호
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: 12345
 *       - name: nickname
 *         description: 사용자 닉네임
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: testAccount
 *       - name: email
 *         description: 사용자 이메일
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: test@volley.com
 *       - name: profileImg
 *         description: 사용자 프로필 이미지 url
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: http://test.com
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success login
 */

exports.userLogin = function(req, res){
    var userInfo = {
        userid: req.query.userid,
        nickname: req.query.nickname,
        email: req.query.email,
        profileimg_thumb: req.query.profileImg
    };

    models.User.findOrCreate({
        where: {userid: userInfo.userid},
        defaults: userInfo
    }).then(function(User){
        var created = User[1];
        if(!created){
            util.success(res,{status: 'exist', user: User[0].seq});
        }else {
            util.success(res,{status: 'new', user: User[0].seq});
        }
    }).catch(function(err){
        console.log(err);
        util.fail(res, "로그인에 실패하였습니다");
    });
};



/**
 * @swagger
 * /user/existNickname:
 *   get:
 *     summary: 닉네임 중복체크
 *     description: 닉네임 중복 체크
 *     tags: [User]
 *     parameters:
 *       - name: nickname
 *         description: 닉네임
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: testAccount
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Check Exist NickName
 */
exports.isExistNickName = function(req, res){
    var nickName = req.query.nickname;

    models.User.count({where: {nickname: nickName}}).then(function(count){
        if(count == 0){
            util.success(res,{exist: false});
        }else if(count >= 1){
            util.success(res,{exist: true});
        }
    });
};


/**
 * @swagger
 * /user/updateNickname:
 *   post:
 *     summary: 닉네임 변경
 *     description: 닉네임 변경
 *     tags: [User]
 *     parameters:
 *       - name: nickname
 *         description: 닉네임
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue: testAccount
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success update nickname
 */
exports.updateNickName = function(req, res){
    var userid = req.session.userid;
    var nickName = req.query.nickname;

    models.User.count({where: {nickname: nickName}}).then(function(count){
        if(count == 0){
            models.User.update({nickname: nickName}, {where: {userid: userid}, returning: false}).then(function(){
                util.success(res, {res: 'success'});
            });
        }else if(count >= 1){
            util.fail(res, "중복된 닉네임이 존재합니다.");
        }
    });
};

/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: 회원 탈퇴
 *     description: 회원 탈퇴
 *     tags: [User]
 *     parameters:
 *       - name: userid
 *         description: 유저 ID
 *         in: query
 *         type: int
 *         required: true
 *         defaultValue: 1
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success login
 */
exports.userDelete = function(req,res){
  var userId = req.query.userid;

  models.Follow.destroy({
      where: {userid: userId}
  }).then(function(){
      models.Like.destroy({
          where: {userid: userId}
      }).then(function () {
          models.Cheering.destroy({
              where: {userid: userId}
          }).then(function(){
              models.PlayerPost.destroy({
                  where: {userid: userId}
              }).then(function(){
                  models.TeamPost.destroy({
                      where: {userid: userId}
                  }).then(function(){
                      models.User.destroy({
                          where: {userid: userId}
                      }).then(function(){
                          util.success(res,'success delete');
                      });
                  });
              });
          });
      });
  });
};