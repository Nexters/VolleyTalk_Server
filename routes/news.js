var config = require('../config/config.json');
var request = require('sync-request');
var async = require('async');
var _ = require('underscore');
var urlMetadata = require('url-metadata');
var moment = require('moment');

// 배구 뉴스 리스트 가져오기
exports.getMainNewsList = function(req, res){

    //배구 뉴스 가져오기
    var response = getNewsDataFromAPI("배구", 10, 1);

    //시간 포맷 변경
    for(var i=0; i<10; i++){
        response.items[i].pubDate = moment(response.items[i].pubDate).format('YYYY-MM-DD hh:mm:ss');
    }

    //시간순으로 정렬
    var temp = _.sortBy(response.items, 'pubDate').reverse();

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
        function(next){task(4,next)}
    ];

    //async 모듈을 통해 동기식으로 데이터를 가져와서 기사 이미지 셋팅(여기서 소요시간이 조금 발생함 -> 차후 개선)
    //async.parallel(imageSetTask, function (err, results) {
    //   var imgArr = results;
    //    for(var i=0; i<5; i++){
    //        temp[i].imgurl = imgArr[i].replace("https","http");
    //    }
        response.items = temp;
        res.send(response);
    //});
};

//팀이름으로 뉴스 검색
exports.getNewsListByTeam = function(req, res){
    var teamName = req.params.team+' 배구단';
    var response = getNewsDataFromAPI(teamName,10,1);

    for(var i=0; i<10; i++){
        response.items[i].pubDate = moment(response.items[i].pubDate).format('YYYY-MM-DD hh:mm:ss');
    }

    response.items = _.sortBy(response.items, 'pubDate').reverse();
    res.send(response);
};

var getNewsDataFromAPI = function(keyword,itemCount,start){
    var url = 'https://openapi.naver.com/v1/search/news.json?query='+keyword+'&display='+itemCount+'&start='+start+'&sort=sim';
    return JSON.parse(request('GET', encodeURI(url) ,
        {'headers': {
            'X-Naver-Client-Id': config.NewsAPI.naverClientId,
            'X-Naver-Client-Secret': config.NewsAPI.naverClientSecret
        }
    }).getBody('utf8'));
};