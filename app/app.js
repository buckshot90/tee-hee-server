var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
//var compress = require('compression');

var app = express();


//app.use(compress());
app.use(favicon(path.normalize(path.join(__dirname, '../public/favicon.ico'))));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

//build routs
require('./config/routes')(app);

// error handlers
require('./config/errorHandlers')(app);

module.exports = app;


