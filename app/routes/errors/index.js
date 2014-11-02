var extend = require('extend');
var config = require('../../config');
var log = require('../../libs/log')(module);
var HttpError = require('../../models/errors/httpError');


module.exports = function (app) {
    var isDevelopment = (config.get('env') == 'development');

    //catch Not Found errors
    app.use(function (req, res, next) {
        next(404);
    });


    //log errors
    app.use(function (err, req, res, next) {
        if (isDevelopment) {
            log.error({message: err.message, stack: err.stack});
        } else {
            log.error(err, req);
        }
        next(err);
    });

    //send errors to client
    app.use(function (err, req, res, next) {
        if (typeof err === 'number') {
            err = new HttpError(err);
        }

        if (err instanceof Error) {
            if (!(err instanceof HttpError)) {
                if (isDevelopment) {
                    err = JSON.parse(JSON.stringify(err, ['stack', 'message', 'name'], 2));
                    err.status = err.status || 500;
                } else {
                    err = new HttpError(500);
                }
            }
        } else {
            err = new HttpError(500);
        }

        if (!isDevelopment)delete err.stack;
        res.status(err.status).send(err);
    });
};

