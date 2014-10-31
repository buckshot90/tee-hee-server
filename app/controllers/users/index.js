var User = require('../../models/user/index');

exports.list = function (req, res, next) {
    User.qfind({}).then(function (users) {
        res.send(users);
    }, next);
};

exports.user = function (req, res, next) {
    res.send(req.user);
};


