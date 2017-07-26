var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.set('config', require('./config/config.json'));

//라우터 설정
require('./routes/index').init(app);

//인터셉터 설정
//require('./interceptor/interceptor').init(app);

//포트 설정
app.set('port', 3000);

//서버 실행
app.listen(app.get('port'), function(){
    console.log('Volley Talk API server start : '+app.get('port'));
});

//서버 최초 실행시 news.json파일 있는지 확인해서 없으면 생성
var newsFileSetUp = function(){
    if(!fs.existsSync('./newsFile')){
        fs.mkdirSync('./newsFile');
        fs.openSync('./newsFile/news.json', 'w');
        require('./routes/news').newsListToJsonFile();
    }
};
newsFileSetUp();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
