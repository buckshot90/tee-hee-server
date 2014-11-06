var winston = require('winston');
var fs = require('fs');
var path = require('path');
var config = require('../config');

var LOG_DIR = config.get('logDir');
var ENV = config.get('env');

fs.exists(LOG_DIR, function (exists) {
    if (!exists)fs.mkdir(LOG_DIR, function (err) {
        if (err) throw err;
    });
});

function makeLogger(name) {
    var transport = null;

    if (ENV === 'development') {
        transport = new winston.transports.Console({
            timestamp: true,
            colorize: true,
            label: name,
            level: 'info'
        });
    } else {
        transport = new winston.transports.File({
            filename: path.join(LOG_DIR, 'error.json'),
            maxsize: 5 * 1024 * 1024,
            maxFiles: 50,
            timestamp: true,
            label: name,
            level: 'error'
        });
    }

    return new winston.Logger({transports: [transport]});
}

module.exports = function (module) {
    var name = module.filename.split(path.sep).slice(-2).join(path.sep);
    return makeLogger(name);
};
