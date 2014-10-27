var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

var config = require('./config');
var log = require('./utils/log')(module);

var ENV = config.get('env');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

//build routs
require('./utils/routes')(app);

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
        res.send({
            message: err.message,
            error: err
        });

        log.error(err, {req: {method: req.method, url: req.url}});
    } else {
        res.send({
            message: err.message,
            error: {}
        });
        log.error(err, req);
    }
});



app.set('port', config.get('port'));
var server = app.listen(app.get('port'), function() {
    log.info('Express server listening on port ' + server.address().port);
});


