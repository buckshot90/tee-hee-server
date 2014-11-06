var Category = require('../../models/category');
var User = require('../../models/user');
var Resource = require('../../models/resource');
var HttpError = require('../../models/errors/httpError');
var ValidationError = require('../../models/errors/validationError');
var config = require('../../config');

var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

exports.filters = {};

exports.list = function (req, res, next) {
    var query = {isPublic: true, lang: req.params.lang};

    if (req.session.user) {
        query = {$or: [query, {author: req.session.user}]};
    }

    Category.qfindWithImage(query).then(function (categories) {
        res.send({categories: categories});
    }, next);
};

exports.category = function (req, res, next) {
    if (req.category.accessType === 'public' ||
        req.category.author.toString() === req.session.user.toString() ||
        User.authorize('manager', req.currentUser)) {
        return res.send({category: req.category});
    }
    return next(403);
};

exports.edit = function (req, res, next) {
    var user = req.currentUser;
    var isPublic = parseBool(req.body.isPublic);
    var label = req.body.label;
    var image = req.body.image;
    var category = req.category;
    var imageBound = null;

    if (!User.authorize('manager')) {
        if (!category.authorize(user) || isPublic) {
            return next(403);
        }
    }

    checkResource(image, req.currentUser).then(function (image) {
        category.isPublic = isPublic;
        category.label = label;
        category.image = image;
        imageBound = image;

        return Q.nbind(category.save, category)();
    }).then(function () {
        category = category.toJSON();
        category.image = imageBound;
        res.send({category: category});
    }).catch(function (err) {
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

exports.create = function (req, res, next) {
    var author = req.currentUser._id;
    var lang = req.params.lang;
    var label = req.body.label;
    var isPublic = parseBool(req.body.isPublic);
    var image = req.body.image;
    var imageBound = null;

    if (isPublic && !User.authorize('manager', req.currentUser)) {
        return next(new HttpError(403));
    }

    checkResource(image, req.currentUser).then(function (image) {
        imageBound = image;
        return Category.create({
            author: author,
            label: label,
            isPublic: isPublic,
            image: image,
            lang: lang
        });
    }).then(function (category) {
        category = category.toJSON();
        category.image = imageBound;
        res.status(201).send({category: category});
    }).catch(function (err) {
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

exports.remove = function (req, res, next) {
    var category = req.category;

    if (!User.authorize('manager', req.currentUser)) {
        if (!category.authorize(req.currentUser) || category.isPublic) {
            return next(403);
        }
    }

    category.remove(function (err) {
        if (err)return next(err);
        res.end();
    });
};

exports.filters.mapModel = function (req, res, next) {
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

exports.filters.checkLang = function (req, res, next) {
    var langs = config.get('enums:languages:values');
    var lang = req.params.lang || '';
    if (langs.indexOf(lang.toLowerCase()) === -1)return next(404);
    next();
};


function parseBool(val) {
    return String(val).toLowerCase() === 'true';
}

function parseImage(image) {
    if (_.isObject(image)) {
        return new ObjectID(image.id);
    } else if (image && _.isString(image)) {
        return new ObjectID(image);
    } else {
        return null;
    }
}

function checkResource(image, user) {
    return Q(image).then(function (image) {
        try {
            return parseImage(image);
        } catch (e) {
            throw new HttpError(400, 'Bad Image Id');
        }
    }).then(function (id) {
        if (!id)return null;

        return Resource.qfindByIdWithAuthor(id).then(function (resource) {
            if (!resource) {
                throw new HttpError(404, 'Image does not exists');
            }
            if (!resource.authorize(user)) {
                throw new HttpError(403);
            }
            return resource;
        });
    });
}