var express = require('express');
var path = require('path');
var extend = require('extend');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

//var compress = require('compression');
var config = require('./config');
var mongoose = require('./libs/mongoose');
var MongoStore = require('connect-mongo')(session);

var PUBLIC_DIR = path.join(__dirname, '../public/');

var app = express();
//app.use(compress());
app.use(favicon(path.normalize(PUBLIC_DIR + 'favicon.ico')));
app.use(express.static(PUBLIC_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(session(extend(config.get("session"), {store: new MongoStore({db: mongoose.connection.db})})));

app.get('/', function (req, res) {
    res.sendFile(PUBLIC_DIR + 'index.html');
});

//build routs
require('./routes')(app);

module.exports = app;

