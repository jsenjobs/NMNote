
/**
 * Created by jsen on 2017/4/19.
 */
var log4js = require('log4js');
var logger = log4js.getLogger('ServiceNote');

var Promise = require("bluebird");

var fs = Promise.promisifyAll(require("fs"));

let Note = require('../model').note;

function _HandleParamsError(msg) {
  return new Promise((resolve,reject)=>{
    resolve({code:1,msg:msg});
  })
}

exports.ListNotebook = function() {
  return Note.findNotebook().then(result => {
    return {code:0, data:result};
  }).catch(err => {
    return {code:1, msg:'无法获取数据',err:err}
  });
}
exports.ListAll = function(page, capacity) {
  // 实现文件下载
  // Mongo.readingFile({filename:fileName}, res);
  return new Note({}).findAll(page,capacity).then(result => {
    return {code:0, data:result};
  }).catch(err => {
    return {code:1, msg:'无法获取数据',err:err}
  });
}
exports.List = function(notebook, page, capacity) {
  // 实现文件下载
  // Mongo.readingFile({filename:fileName}, res);
  return Note.findInNotebook(notebook, page,capacity).then(result => {
    return {code:0, data:result};
  }).catch(err => {
    return {code:1, msg:'无法获取数据'}
  });
}

exports.Update = function(notebook, title, describe, url, author) {
  let data = {};
  if(!notebook) {
    return _HandleParamsError('参数有误');
  } else {
    data.notebook = notebook;
  }
  if(!describe && !url) {
    return _HandleParamsError('参数有误');
  }
  if(describe) {
    data.describe = describe;
  }
  if (url) {
    data.url = url;
  }
  if(!title) {
    return _HandleParamsError('参数有误');
  }
  data._id = title;
  data.title = title;
  if(author) {
    data.author = author;
  }
  return new Note({}).update({_id:title}, data).then(() => {
    return {code:0};
  }).catch(() => {
    return {code:1,msg:'执行出错'}
  });
}

exports.Insert = function(notebook, title, describe, url, author) {

  if(!title || !describe || !url || !notebook) {
    return ServiceNote._HandleParamsError('参数有误');
  }
  return new Note().insert(notebook, title, describe, url, author).then((data) => {
    return {code:0, data:data};
  }).catch(() => {
    return {code:1, msg:'文件存在或处理出错'};
  });
}

exports.Remove = function(notebook, title) {
  if(!title || !notebook) {
    return ServiceNote._HandleParamsError('参数有误');
  }
  return new Note({_id:title, notebook:notebook}).remove().then(() => {
    return {code:0};
  }).catch(() => {
    return {code:1, msg:'处理出错'};
  });
}