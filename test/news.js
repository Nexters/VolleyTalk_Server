'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

// routes/news.js/newsList
describe('API Endpoint Test', function(){
    describe('GET request on /newsList', function(){
        it('should return status code 200', function(done){
            chai.request(server)
            .get('/newsList')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
        }).timeout(15000);
    });
});
