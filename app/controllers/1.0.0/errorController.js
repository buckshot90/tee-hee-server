var config = require('../../config/index');
var log = require('../../libs/log')(module);
var HttpError = require('../../models/errors/httpError');

var IS_DEVELOPMENT = (config.get('env') == 'development');

exports.notFound = function (req, res, next) {
    next(404);
};

exports.logErrors = function (err, req, res, next) {
    if (IS_DEVELOPMENT) {
        log.error({message: err.message, stack: err.stack});
    } else {
        log.error(err, req);
    }
    next(err);
};

exports.catchAll = function (err, req, res, next) {
    if (typeof err === 'number') {
        err = new HttpError(err);
    }

    if (err instanceof Error) {
        if (!(err instanceof HttpError)) {
            if (IS_DEVELOPMENT) {
                err = JSON.parse(JSON.stringify(err, ['stack', 'message', 'name'], 2));
                err.status = err.status || 500;
            } else {
                err = new HttpError(500);
            }
        }
    } else {
        err = new HttpError(500);
    }

    res.removeHeader('Content-Type');

    if (!IS_DEVELOPMENT)delete err.stack;
    res.status(err.status).send({error: err});
};


