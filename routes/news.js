var config = null;
var request = require('sync-request');
var async = require('async');
var _ = require('underscore');
var urlMetadata = require('url-metadata');
var moment = require('moment');
var cron = require('cron');
var fs = require('fs');
var util = require('../util/util');

exports.init = function(app){
   config = app.get('config');
};

//1시간 단위로 뉴스를 json파일로 저장함
new cron.CronJob('00 00 * * * *', function(){
    exports.newsListToJsonFile();
}, null, true, 'Asia/Seoul');

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News 관련 API
 */

/**
 * @swagger
 * /news/list:
 *   get:
 *     summary: 메인 뉴스 리스트 가져오기
 *     description: 이미지 URL을 포함한 뉴스 10개 리스트 가져오기
 *     tags: [News]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get News
*/
// 배구 뉴스 리스트 가져오기
exports.getMainNewsList = function(req, res) {
    var fileRead = fs.readFileSync('./newsFile/news.json', 'utf8');
    var newsData = JSON.parse(fileRead);
    util.success(res, newsData);
};

/**
 * @swagger
 * /news/list:
 *   get:
 *     summary: 팀 이름에 따른 뉴스리스트
 *     description: 팀이름으로 뉴스리스트 불러오기
 *     tags: [News]
 *     parameters:
 *       - name: team
 *         description: Team name
 *         in: query
 *         type: string
 *         required: true
 *         defaultValue : 대한항공 점보스
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get News
 */
//팀이름으로 뉴스 검색
exports.getNewsListByTeam = function(req, res){
    var teamName = req.query.team+' 배구단';
    var response = getNewsDataFromAPI(teamName,15,1);
    util.success(res, response);
};

exports.newsListToJsonFile = function(){

    //배구 뉴스 가져오기
    var response = getNewsDataFromAPI("배구", 15, 1);

    //시간순으로 정렬
    var temp = response.items;

    //메타데이터로부터 이미지 url 가져오는 함수
    function task(i, callback) {
        urlMetadata(temp[i].link).then(
            function (metadata) { // success handler
                callback(null, metadata.image);
            },
            function (error) { // failure handler
                console.log(error);
                return "default img url";
            }
        );
    }

    //task 셋팅
    var imageSetTask = [
        function(next){task(0,next)},
        function(next){task(1,next)},
        function(next){task(2,next)},
        function(next){task(3,next)},
        function(next){task(4,next)},
        function(next){task(5,next)}
    ];

    //async 모듈을 통해 동기식으로 데이터를 가져와서 기사 이미지 셋팅(여기서 소요시간이 조금 발생함 -> 차후 개선)
    async.parallel(imageSetTask, function (err, results) {
        for(var i=0; i<6; i++){
            temp[i].imgurl = results[i].replace("https","http");
        }
        response.items = temp;

        console.log("write news data to json : " + new Date());
        var stream = fs.createWriteStream("./newsFile/news.json");
        stream.write(JSON.stringify(response));
        stream.end();
    });
};

var getNewsDataFromAPI = function(keyword,itemCount,start){
    var url = 'https://openapi.naver.com/v1/search/news.json?query='+keyword+'&display='+itemCount+'&start='+start+'&sort=sim';

    var response = JSON.parse(request('GET', encodeURI(url) ,
        {'headers': {
            'X-Naver-Client-Id': config.NewsAPI.naverClientId,
            'X-Naver-Client-Secret': config.NewsAPI.naverClientSecret
        }
    }).getBody('utf8'));

    for(var i=0; i<itemCount; i++){
        response.items[i].pubDate = moment(response.items[i].pubDate).format('YYYY-MM-DD hh:mm:ss');
        response.items[i].title = response.items[i].title.replace(/(<([^>]+)>)/ig,"");
        response.items[i].description = response.items[i].description.replace(/(<([^>]+)>)/ig,"");
    }

    response.items = _.sortBy(response.items, 'pubDate').reverse();
    return response;
};