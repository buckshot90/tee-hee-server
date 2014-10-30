var User = require('../../models/user');
var HttpError = require('../../libs/httpError');
var ObjectID = require('mongodb').ObjectID;


exports.list = function (req, res, next) {
    User.qfind({}).then(function (users) {
        res.send(users);
    }, next);
};

exports.getById = function (req, res, next) {
    id = getId(req);
    if (!id)return next(404);

    User.qfindOne({_id: req.params.id}).then(function (user) {
        if (!user)return next(404);
        res.send(user);
    }, next);
};


function getId(req) {
    try {
        return new ObjectID(req.params.id);
    } catch (e) {
        return null;
    }
}