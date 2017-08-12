//userid nickname email profileimg_thumb, bgimg

var sequelize, models;

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
            res.send({status: 'exist', user: User[0].seq});
        }else {
            res.send({status: 'new', user: User[0].seq});
        }
    }).catch(function(err){
        console.log(err);
        res.send({status: false});
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
                          res.send('{status:delete}');
                      });
                  });
              });
          });
      });
  });
};