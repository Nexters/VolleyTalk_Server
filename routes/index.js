var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
var options = {
    swaggerDefinition: {
        info: {
            title: 'Volley Talk API Docs',
            description: 'Volley Talk 서버 API 문서 (Nexters 11기)',
            version: '1.0.0',
            contact: {
                name: 'Mike Kim',
                email: 'nser789@gmail.com'
            }
        }
    },
    apis: ['./routes/*']
};
var swaggerSpec = swaggerJSDoc(options);

var index = require('../models/index');
var news = require('./news');
var team = require('./team');
var player = require('./player');
var follow = require('./follow');
var like = require('./like');
var post = require('./post');
var user = require('./user');
var comment = require('./comment');
var cheering = require('./cheering');

exports.init = function(app) {
    //swagger 설정
    app.get('/api-docs.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false, {validatorUrl :null}));

    //route 파일 init
    index.init(app);
    news.init(app);
    team.init(app);
    player.init(app);
    follow.init(app);
    like.init(app);
    post.init(app);
    user.init(app);
    comment.init(app);
    cheering.init(app);

    //사용자 API
    app.post('/user/login', user.userLogin);
    app.post('/user/delete', user.userDelete);
    app.get('/user/existNickname', user.isExistNickName);
    app.post('/user/updateNickname', user.updateNickName);

    //뉴스 API
    app.get('/news/list', news.getMainNewsList);           //뉴스탭에서 사용할 뉴스리스트 가져오기
    app.get('/news/list/team', news.getNewsListByTeam);   //팀 이름으로 뉴스리스트 가져오기
    app.get('/news', news.newsListToJsonFile);

    //팀 API
    app.get('/team/list', team.getTeamList);  //구단 정보 가져오기

    //선수 API
    app.get('/player/list', player.getPlayerList);  //선수 리스트
    app.get('/player/info', player.getPlayerInfo);  //선수 정보 가져오기

    //팔로우 API
    app.get('/follow/list', follow.getFollowList);
    app.post('/follow/apply', follow.postFollow);

    //라이크 API
    app.get('/like/list', like.getLikeList);
    app.post('/like/apply', like.postLike);

    //포스트 API
    app.get('/post/list', post.getPostList);
    app.post('/post/apply', post.postPost);
    app.get('/post/img/list', post.getImgList);

    //코멘트 API
    app.get('/comment/list', comment.getCommentList);
    app.post('/comment/apply', comment.commentApply);
    //응원하기 API
    app.get('/cheering/list', cheering.cheeringList);
    app.post('/cheering/apply', cheering.cheeringApply);

};