var Category = require('../../models/category');
var User = require('../../models/user');
var HttpError = require('../../models/errors/httpError');
var ValidationError = require('../../models/errors/validationError');
var config = require('../../config');

var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

exports.filters = {};

exports.list = function (req, res, next) {
    var query = {accessType: 'public', lang: req.params.lang};

    if (req.session.user) {
        query = {$or: [query, {author: req.session.user}]};
    }

    Category.qfind(query).then(function (categories) {
        res.send({categories: categories});
    }, next);
};

exports.category = function (req, res, next) {
    next(new Error('Not Implemented'));
};

exports.create = function (req, res, next) {
    var author = req.currentUser._id;
    var label = req.body.label;
    var accessType = req.body.accessType || 'private';
    var image = req.body.image;
    var lang = req.body.lang || 'en';

    if (accessType === 'public' && !User.authorize('manager', req.currentUser)) {
        return next(new HttpError(403));
    }

    Category.create({
        author: author,
        label: label,
        accessType: accessType,
        image: image,
        lang: lang
    }).then(function (category) {
        res.status(201).send(category);
    }, function (err) {
        if (err instanceof ValidationError) {
            if (_.isObject(err.errors)) {
                var first = err.errors[Object.keys(err.errors)[0]] || {};
                return next(new HttpError(400, first.message));
            }
            return next(new HttpError(400, err.message));
        }
        return next(err);
    });
};

exports.filters.mapModel = function (req, res, next) {
    next(new Error('Not Implemented'));
};
exports.filters.checkLang = function (req, res, next) {
    var langs = config.get('enums:languages:values');
    var lang = req.params.lang || '';
    if (langs.indexOf(lang.toLowerCase()) === -1)return next(404);
    next();
};