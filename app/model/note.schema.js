/**
 * Created by jsen on 2017/4/12.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let Promise = require("bluebird");

/*
 var NoteSchema = new Schema({
 filename : { type: ObjectId },                    //用户账号
 filedata: {type: String},                        //密码
 createby: {type: String},                        //年龄
 createtime: {type: Date},                        //年龄
 updatetime : { type: Date}                       //最近登录时间
 });
 */
var NoteSchema = new Schema({
  _id : { type: String },                    //用户账号
  title: {type: String},                        //名字
  describe: {type: String},                        //描述
  url: {type: String},                        //内容Url
  author: {type:String},    // 作者
  notebook: {type:String},  // 所属的notebook
  createtime:{type:Date},
  modifytime:{type:Date}
});

NoteSchema.statics.findNotebook = function () {
  var query = mongoose.model('note').find();
  query.distinct('notebook');
  return query.exec();
};
NoteSchema.methods.findAll = function (page, capacity) {
  var query = this.model('note').find();
  query.limit(capacity * 1);
  query.skip((page - 1) * capacity);
  return query.exec();
};
NoteSchema.statics.findInNotebook = function (notebook, page, capacity) {
  var query = mongoose.model('note').find({notebook:notebook});
  query.limit(capacity * 1);
  query.skip((page - 1) * capacity);
  return query.exec();
};
NoteSchema.methods.update = function (filter, data) {
  data.modifytime = new Date();
  return this.model('note').update(filter, {$set:data});
};
NoteSchema.methods.insert = function (notebook, title, describe, url, author) {
  let date = new Date();
  if(title) {
    this._id = title;
    this.title = title;
  }
  if (describe)
    this.describe = describe;
  if (url)
    this.url = url;
  if(notebook) {
    this.notebook = notebook;
  }
  if(author) {
    this.author = author;
  }
  this.createtime = date;
  this.modifytime = date;
  return this.save();
};
exports.note = mongoose.model('note', NoteSchema);
