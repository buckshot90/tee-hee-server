var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');
var ValidationError = require('../../models/errors/validationError');

exports.login = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    return User.auth(username, password).then(function (user) {
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

    User.signUp(username, password, email).then(function (user) {
        req.session.user = user._id;
        res.send(user);
    }).catch(function (err) {
        if (err instanceof AuthError || err instanceof ValidationError) {
            return next(new HttpError(400, err.message));
        }
        return next(err);
    });
};


