/**
 * Created by pov on 29.10.2014.
 */
var _base = require('./_base');
var User = require('../../models/user');
var Q = require('q');

function UsersController() {
    _base.apply(this, arguments);

    this.index = function (req, res, next) {
        User.nfind({}).then(function (users) {
            res.send(users);
        }).catch(function (err) {
            next(err);
        });
    };
}

module.exports = UsersController;