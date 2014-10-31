var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('Q');

exports.setCurrentUser = function (req, res, next) {
    if(!req.session.user) return next();

    Q(req).then(checkUserSessionId).then(User.qfindById).then(function (user) {
        if (!user)throw new AuthError();
        req.currentUser = user;
        next();
    }).catch(function (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(401, err.message));
        }
        return next(err);
    });
};

exports.checkAuth = function (req, res, next) {
    if(!req.currentUser) return next(new HttpError(401));
    return next();
};

function checkUserSessionId(req) {
    try {
        return new ObjectID(req.session.user);
    } catch (e) {
        throw new AuthError('Bad session id');
    }
}
