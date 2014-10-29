var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
//var compress = require('compression');

var app = express();

var config = require('./config');
var log = require('./libs/log')(module);

var ENV = config.get('env');

//app.use(compress());
app.use(favicon(path.normalize(path.join(__dirname, '../public/favicon.ico'))));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

//build routs
require('./config/routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    if (ENV === 'development') {
        res.json({
            message: err.message,
            error: err
        });

        log.error(err, {req: {method: req.method, url: req.url, body: req.body}});
    } else {
        res.json({
            message: err.message,
            error: {}
        });
        log.error(err, req);
    }
});


module.exports = app;


