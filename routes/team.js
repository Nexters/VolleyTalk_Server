var sequelize, models;

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team 관련 API
 */

/**
 * @swagger
 * /team/list/{gender}:
 *   get:
 *     summary: 구단 목록 + 상세정보 가져오기
 *     description: 구단 상세정보를 리스트로 넘겨줌(like 정보 포함 - likes)
 *     tags: [Team]
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
 *         description: Success get Team List
 */
exports.getTeamList = function(req, res){
    var gender = req.params.gender;
    var userid = req.session.userid;

    models.Team.findAll({
        where: {gender: gender},
        include: [{model: models.Like, as: 'like', attributes: ['seq'], where: {liketype: 'team', userid: userid}, required: false},
                  {model: models.Follow, as: 'follow', attributes: ['seq'], where: {followtype: 'team', userid: userid}, required: false}]
    }).then(function(teams){
        res.send(teams);
    });
};
