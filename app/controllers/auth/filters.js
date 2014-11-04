var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('Q');


exports.authorize = function (accessLevel) {
    return function (req, res, next) {
        if (!req.session.user) return next(new HttpError(401));

        restoreUser(req.session.user).then(function (user) {
            if (User.authorize(accessLevel, user)) {
                req.currentUser = user;
                return next();
            }
            throw new HttpError(403);
        }).catch(function (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            }
            return next(err);
        });
    }
};

exports.authenticate = function (req, res, next) {
    if (!req.session.user) return next();

    restoreUser(req.session.user).then(function (user) {
        req.currentUser = user;
        return next();
    }).catch(function (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message));
        }
        return next(err);
    });
};




function restoreUser(id) {
    return Q(id).then(function () {
        try {
            return new ObjectID(id);
        } catch (e) {
            throw new AuthError('Bad session id');
        }
    }).then(User.qfindById).then(function (user) {
        if (!user)throw new AuthError('Session user not found');
        return user;
    });
}