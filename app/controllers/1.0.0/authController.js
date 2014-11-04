var User = require('../../models/user');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ValidationError = require('../../models/errors/validationError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('Q');
var _ = require('underscore');

exports.filters = {};


exports.login = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    return User.authenticate(username, password).then(function (user) {
        req.session.user = user._id;
        return res.send(user);
    }).catch(function (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message));
        }
        return next(err);
    });

};

exports.logOut = function (req, res, next) {
    req.session.destroy();
    res.end();
};

exports.signUp = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    User.create(username, password, email).then(function (user) {
        req.session.user = user._id;
        res.send(user);
    }).catch(function (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(400, err.message));
        } else if (err instanceof ValidationError) {
            if (_.isObject(err.errors)) {
                var first = err.errors[Object.keys(err.errors)[0]] || {};
                return next(new HttpError(400, first.message));
            }
            return next(new HttpError(400, err.message));
        }
        return next(err);
    });
};

exports.filters.authorize = function (accessLevel) {
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

exports.filters.mapCurrentUser = function (req, res, next) {
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