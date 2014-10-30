var express = require('express');
var path = require('path');
var extend = require('extend');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var morgan = require('morgan');

//var compress = require('compression');
var config = require('./config/config');
var mongoose = require('./libs/mongoose');


var PUBLIC_DIR = path.join(__dirname, '../public/');
var VIEWS_DIR = path.join(__dirname, 'views');

var MongoStore = require('connect-mongo')(session);


var app = express();
//app.use(compress());
app.use(favicon(path.normalize(PUBLIC_DIR + 'favicon.ico')));
app.use(express.static(PUBLIC_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(session(extend(config.get("session"), {store: new MongoStore({db: mongoose.connection.db})})));

app.engine('ejs', require('ejs-locals'));
app.set('views', VIEWS_DIR);
app.set('view engine', 'ejs');


//build routs
require('./config/routes')(app);

// error handlers
require('./config/errorHandlers')(app);

module.exports = app;

