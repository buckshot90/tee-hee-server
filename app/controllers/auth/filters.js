var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('Q');

exports.checkAuth = function (req, res, next) {
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

function checkUserSessionId(req) {
    try {
        return new ObjectID(req.session.user);
    } catch (e) {
        throw new AuthError('Bad session id');
    }
}
