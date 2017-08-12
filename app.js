var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config/config.json');
var fs = require('fs');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('config', config);
app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'prod' ) ? 'prod' : 'dev';

//인증 인터셉터 설정
require('./interceptor/interceptor').init(app);

//라우터 설정
require('./routes/index').init(app);

//포트 설정
app.set('port', 3000);

//서버 실행
app.listen(app.get('port'), function(){
    console.log('Volley Talk API server start : '+app.get('port'));
});

//news.json파일 생성
if(!fs.existsSync('./newsFile')){
    fs.mkdirSync('./newsFile');
    require('./routes/news').newsListToJsonFile();
}

//이미지 폴더 생성
if(!fs.existsSync('./img')){
    fs.mkdirSync('./img');
}

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
