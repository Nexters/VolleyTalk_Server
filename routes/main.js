var news = require('./news');
//var team = require('./team');
//var player = require('./player');
//var like = require('./like');
//var user = require('./user');

exports.init = function(app) {
    app.get('/newsList/', news.getMainNewsList);
}