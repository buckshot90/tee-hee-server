var User = require('../../models/user');
var HttpError = require('../../libs/httpError');


function UsersController() {
    this.index = function (req, res, next) {
        User.find({}, function (err, users) {
            if (err)return next(err);
            res.send(users);
        });
    };

    this.getById = function (req, res, next) {
        User.findOne({_id: req.params.id}, function (err, user) {
            if (err)return next(err);
            if (!user)return next(new HttpError(404, 'User not found'));
            res.send(user);
        });
    };
}

module.exports = UsersController;