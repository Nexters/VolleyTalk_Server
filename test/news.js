'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

describe('VolleyServer API Test', function(){
    describe('배구뉴스 리스트 가져오기 - (/news/getList, GET)', function(){
        var response;
        this.timeout(20000);

        before(function (done) {
            chai.request(server)
                .get('/news/getList')
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });

        it("상태코드 200", function () {
            response.should.have.status(200);
        });

        it("10개 가져오기", function () {
            response.body.display.should.equal(10);
        });
    });

    describe('구단별 뉴스 리스트 가져오기 - (/news/getList/:team, GET)', function(){
        var response;

        before(function (done) {
            chai.request(server)
                .get('/news/getList')
                .send({'team':'대한항공'})
                .end(function (err, res) {
                    response = res;
                    done();
                });
        });

        it("상태코드 200", function () {
            response.should.have.status(200);
        });

        it("10개 가져오기", function () {
            response.body.display.should.equal(10);
        });
    });
});
