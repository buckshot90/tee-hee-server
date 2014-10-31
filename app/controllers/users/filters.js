var User = require('../../models/user/index');
var HttpError = require('../../models/errors/httpError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

exports.mapUserModel = function (req, res, next) {
    Q(req).then(checkUserId).then(User.qfindById).then(function (user) {
        if (!user)throw new HttpError(404, 'User Not Found');
        req.user = user;
        next();
    }).catch(next);
};


function checkUserId(req) {
    try {
        return new ObjectID(req.params.id);
    } catch (e) {
       throw new HttpError(404, 'User Not Found');
    }
}



