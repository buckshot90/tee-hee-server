var User = require('../../models/user');
var HttpError = require('../../libs/httpError');

exports.login = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.qfindOne({username: username}).then(function (user) {
        if (user && user.checkPassword(password)) {
            req.session.user = user._id;
            return res.send(user);
        } else {
            throw new HttpError(403, 'Invalid username or password');
        }
    }, next);
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