
var log4js = require('log4js');
var logger = log4js.getLogger('ControllerNote');

exports.ListNotebook = function(req, res) {
  logger.info('ListNotebook Api Call');
  req.models.note.ListNotebook().then(json => {
    res.json(json);
  }).catch(() => {
    return {code:1, msg:'无法获取数据'}
  });
}

exports.ListAll = function(req, res) {
  logger.info('ListAll Api Call');
  let page = req.params.page;
  let capacity = req.params.capacity;

  if (page>0 && capacity>0) {
    req.models.note.ListAll(page, capacity).then(json => {
      res.json(json);
    }).catch(() => {
      return {code:1, msg:'无法获取数据'}
    });
  } else {
    req.models.note.ListAll(1, 1000).then(json => {
      res.json(json);
    }).catch(() => {
      return {code:1, msg:'无法获取数据'}
    });
  }
}

exports.List = function(req, res) {
  logger.info('List Api Call');
  let notebook = req.params.notebook;
  let page = req.params.page;
  let capacity = req.params.capacity;
  if (page>0 && capacity>0) {
    req.models.note.List(notebook, page, capacity).then(json => {
      res.json(json);
    }).catch(() => {
      return {code:1, msg:'无法获取数据'}
    });
  } else {
    req.models.note.List(notebook, 1, 1000).then(json => {
      res.json(json);
    }).catch(() => {
      return {code:1, msg:'无法获取数据'}
    });
  }
}

exports.Update = function(req, res) {
  logger.info('Update Api Call');
  let notebook=req.body.notebook;
  let title=req.body.title;
  let describe=req.body.describe;
  let url=req.body.url;
  let author=req.body.author;
  req.models.note.Update(notebook, title, describe, url, author).then(json => {
    res.json(json);
  }).catch(() => {
    return {code:1, msg:'处理出错'}
  });
}

exports.Insert = function(req, res) {
  logger.info('Insert Api Call');
  let notebook=req.body.notebook;
  let title=req.body.title;
  let describe=req.body.describe;
  let url=req.body.url;
  let author=req.body.author;
  req.models.note.Insert(notebook, title, describe, url, author).then(json => {
    res.json(json);
  });
}

exports.Remove = function(req, res) {
  // logger.info('Remove Api Call:');
  let notebook=req.params.notebook;
  let title=req.params.title;
  logger.info('Remove Api Call:'+notebook+' '+title);
  req.models.note.Remove(notebook, title).then(json => {
    res.json(json);
  });
}