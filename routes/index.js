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
//var like = require('./like');
//var user = require('./user');

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

    //뉴스 API
    app.get('/news/list', news.getMainNewsList);           //뉴스탭에서 사용할 뉴스리스트 가져오기
    app.get('/news/list/:team', news.getNewsListByTeam);   //팀 이름으로 뉴스리스트 가져오기

    //팀 API
    app.get('/team/list/:gender', team.getTeamList);  //구단 정보 가져오기

    //선수 API
    app.get('/player/list/:gender', player.getPlayerList);  //구단 정보 가져오기
    app.get('/player/info/:playerseq', player.getPlayerInfo);  //구단 정보 가져오기
};