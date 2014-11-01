var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('Q');

exports.checkAuth = function (req, res, next) {
    if(!req.session.user) return next(new HttpError(401));

    Q(req).then(function (req) {
        try {
            return new ObjectID(req.session.user);
        } catch (e) {
            throw new AuthError('Bad session id');
        }
    }).then(User.qfindById).then(function (user) {
        if (!user)throw new AuthError('Session user not found');
        req.currentUser = user;
        next();
    }).catch(function (err) {
        req.session.destroy();
        if (err instanceof AuthError) {
            return next(new HttpError(401, err.message));
        }
        return next(err);
    });
};
