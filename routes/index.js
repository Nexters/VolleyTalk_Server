var index = require('../models/index');
var news = require('./news');
var team = require('./team');
//var player = require('./player');
//var like = require('./like');
//var user = require('./user');

exports.init = function(app) {
    index.init(app);
    team.init(app);

    //뉴스 API
    app.get('/news/getList', news.getMainNewsList);           //뉴스탭에서 사용할 뉴스리스트 가져오기
    app.get('/news/getList/:team', news.getNewsListByTeam);   //팀 이름으로 뉴스리스트 가져오기

    //팀 API
    app.get('/team/teamName', team.getTeam);  //구단 이름 가져오기
};