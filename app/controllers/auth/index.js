var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var AuthError = require('../../models/errors/authError');

exports.login = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.auth(username, password).then(function (user) {
        req.session.user = user._id;
        return res.send(user);
    }, function (err) {
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message));
        }
        return next(err);
    });
};

exports.signUp = function (req, res, next) {
    /* var username = req.body.username;
     var password = req.body.password;

     User.findOne({username: username}, function (err, user) {
     if (err)return next(err);
     if (user && user.checkPassword(password)) {
     req.session.user = user._id;
     return res.send(user);
     } else {
     return next(new HttpError(403, 'Invalid username or password'));
     }
     });*/
    next(new HttpError(400, 'Action Not Implemented'));
};

