
require('../app/utils/env').env.ENVSET();
require('./log4jConfig').set();

var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent');
var expect = require('expect.js');
let _ = require('lodash');

let notebooks = ['notebookff'];
let notes = [{title:'t1sdfsf',describe:'desdfdss1',url:'ursdf1',author:'ausfds1'}];
let data = [];
describe('server', function () {
	before(function() {
		boot();
		notebooks.forEach(notebookP => {
			notes.forEach(noteP => {
				data.push(_.assign({notebook:notebookP}, noteP));
			})
		})
	});

describe('notebook', function() {
	it('list notebook', function(done) {
		superagent.get('http://localhost:'+port+'/list/notebook').end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			expect(json.code).to.equal(0);
			expect(json.data).to.be.a('object');
			done();
		})
	});
	it('list all note', function(done) {
		superagent.get('http://localhost:'+port+'/listAll/1/20').end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			expect(json.code).to.equal(0);
			expect(json.data).to.be.a('object');
			expect(json.data.length<=20).to.be.ok;
			done();
		})
	});
	it('list all note one notebook', function(done) {
		superagent.get('http://localhost:'+port+'/list/test/1/20')
		.end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			expect(json.code).to.equal(0);
			expect(json.data).to.be.a('object');
			expect(json.data.length<=20).to.be.ok;
			done();
		})
	});
	it('insert', function(done) {
		superagent.post('http://localhost:'+port+'/insert')
		.send(data[0])
		.end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			if(json.code !== 0) {
				expect(json.code).to.equal(1);
				expect(json.msg).to.equal('文件存在或处理出错');
			} else {
				expect(json.code).to.equal(0);
			}
			done();
		});
	});
	it('update', function(done) {
		superagent.post('http://localhost:'+port+'/update')
		.send(data[0])
		.end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			expect(json.code).to.equal(0);
			done();
		});
	});

	it('delete', function(done) {
		data.forEach(item => {
			superagent.get('http://localhost:'+port+'/delete/'+item.notebook+'/'+item.title).end(function(err,res){
				let json = res.body;
				expect(res.status).to.equal(200);
				expect(json.code).to.equal(0);
				done();
			});
		});
	});

});


describe('app status', function() {

	it('show app status', function(done) {
		superagent.get('http://localhost:'+port+'/app/status?info=true').end(function(err,res){
			let json = res.body;
			expect(res.status).to.equal(200);
			expect(json.status).to.be.equal('up');
			done();
		})
	});

});

after(function() {
	shutdown();
})
})