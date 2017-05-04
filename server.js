let log4js = require('log4js');
let logger = log4js.getLogger('server');

let express = require('express');
let http = require('http');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require('path');

let bodyParser = require('body-parser');
let cors            = require('cors');


let app = express();

let Apis = require('./mock/mock.api.json');

let models = require('./app/service');
app.use(function(req,res, next) {
    if(!models.note) {
        return next(new Error('No Models Registed'));
    }
    req.models = models;
    return next();
})

// app.use(bodyParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
let errorHandler = require('errorhandler');
if(process.env.NODE_ENV === 'development') {
    app.use(errorHandler({
        dumpExceptions:true,
        showStack:true
    }));
} else if(process.env.NODE_ENV === 'production') {
    app.use(errorHandler());
}

/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('x-powered-by', 'Jsen');
    next();
});*/

let cRoutes = require('./app/controller');
app.get('/note/list/notebook', cRoutes.note.ListNotebook);
app.get('/note/listAll/:page/:capacity', cRoutes.note.ListAll);
app.get('/note/list/:notebook/:page/:capacity', cRoutes.note.List);
app.post('/note/update', cRoutes.note.Update);
app.post('/note/insert', cRoutes.note.Insert);
app.get('/note/delete/:notebook/:title', cRoutes.note.Remove);
app.get('/note/app/status', cRoutes.app.status);

require('./app/db').mongoose.boot();


app.all('*', function (req, res) {
    res.status(404).json({code:404,msg:'没有此Api', _links:Apis});
});

app.use(function(err, req, res, next){
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({'code':500,msg:'发生未知错误', _links:Apis});
});

let PORT = process.env.PORT || 3000;



var server = http.createServer(app);
server.on('error', (err) => {
    logger.error(err);
});
process.addListener('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
})
function boot () {
    if (app.get('env') === 'test') return;
    app.listen(PORT, function () {
        logger.info('服务器端口：'+PORT)
    });
}

function shutdown() {
    server.close();
}

exports.app = app;
exports.boot = boot;
exports.shutdown = shutdown;
exports.port = PORT;
if(require.main === module) {
    require('./boot');
} else {
    console.log('Running app as a module');
}
