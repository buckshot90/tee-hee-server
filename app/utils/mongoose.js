var mongoose = require('mongoose');
var config = require('../config');
var mconf = config.get('mongoose');

mongoose.connect(mconf.uri, mconf.options);

module.exports = mongoose;