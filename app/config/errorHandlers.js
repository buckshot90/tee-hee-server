var extend = require('extend');
var config = require('./config');
var log = require('../libs/log')(module);
var HttpError = require('../libs/httpError');


module.exports = function (app) {
    var ENV = config.get('env');

    app.use(function (err, req, res, next) {
        if (typeof err === 'number') {
            err = new HttpError(err);
        }

        if (!(err instanceof HttpError)) {

            if (ENV === 'development') {
                err = extend({
                    message: err.message,
                    status: err.status || 500,
                    stack: err.stack
                }, err);
                log.error(err);
            } else {
                log.error(err, req);
                err = new HttpError(500);
            }
        }

        res.status(err.status || 500);
        res.send(err);

    });
};
