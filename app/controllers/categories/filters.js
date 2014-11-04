var Category = require('../../models/category/index');
var HttpError = require('../../models/errors/httpError');
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

exports.mapModel = function (req, res, next) {
    Q(req).then(function (req) {
        try {
            return new ObjectID(req.params.id);
        } catch (e) {
            throw new HttpError(404, 'Category Not Found');
        }
    }).then(Category.qfindById).then(function (category) {
        if (!category)throw new HttpError(404, 'Category Not Found');
        req.category = category;
        next();
    }).catch(next);
};






