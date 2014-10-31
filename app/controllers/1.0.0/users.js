var Q = require('Q');
var User = require('../../models/user');
var HttpError = require('../../libs/httpError');
var ObjectID = require('mongodb').ObjectID;


exports.list = function (req, res, next) {
    User.qfind({}).then(function (users) {
        res.send(users);
    }, next);
};

exports.getById = function (req, res, next) {
    Q(checkId(req.params.id)).then(User.qfindById).then(function (user) {
        if (!user)return next(404);
        res.send(user);
    }, next);
};


function checkId(id) {
    try {
        return new ObjectID(id);
    } catch (e) {
        throw  new HttpError(404);
    }
}