var User = require('../../models/user');


function UsersController() {
    this.index = function (req, res, next) {
        User.qfind({}).then(function (users) {
            res.send(users);
        }).catch(function (err) {
            next(err);
        });
    };
}

module.exports = UsersController;