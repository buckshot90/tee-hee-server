var Card = require('../../models/card');
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
    var query = {category: req.category._id};
    Card.qfindAndPopulate(query, ['image', 'audio']).then(function (cards) {
        res.send({cards: cards});
    }, next);
};

exports.card = function (req, res, next) {
    return next(new Error('Not Implemented'));
};

exports.edit = function (req, res, next) {
    return next(new Error('Not Implemented'));
};

exports.create = function (req, res, next) {
    var author = req.currentUser._id;
    var label = req.body.label;
    var image = req.body.image;
    var audio = req.body.audio;
    var imageBound = null;
    var audioBound = null;

    checkResource(image, req.currentUser).then(function (image) {
        imageBound = image;
        return checkResource(audio, req.currentUser);
    }).then(function (audio) {
        audioBound = audio;
        return Card.create({
            author: author,
            label: label,
            image: imageBound,
            audio: audioBound,
            category: req.category
        });
    }).then(function (card) {
        card = card.toJSON();
        card.image = imageBound;
        card.audio = audioBound;
        res.status(201).send({card: card});
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
    return next(new Error('Not Implemented'));
};

exports.filters.mapModel = function (req, res, next) {
    Q(req).then(function (req) {
        try {
            return new ObjectID(req.params.cid);
        } catch (e) {
            throw new HttpError(404, 'Card Not Found');
        }
    }).then(Card.qfindById).then(function (card) {
        if (!card)throw new HttpError(404, 'Card Not Found');
        req.card = card;
        next();
    }).catch(next);
};


function parseResource(resource) {
    if (_.isObject(resource)) {
        return new ObjectID(resource.id);
    } else if (resource && _.isString(resource)) {
        return new ObjectID(resource);
    } else {
        return null;
    }
}

function checkResource(resource, user) {
    return Q(resource).then(function (resource) {
        try {
            return parseResource(resource);
        } catch (e) {
            throw new HttpError(400, 'Bad Image Id');
        }
    }).then(function (id) {
        if (!id)return null;

        return Resource.qfindByIdWithAuthor(id).then(function (resource) {
            if (!resource) {
                throw new HttpError(404, 'Resource does not exists');
            }
            if (!resource.authorize(user)) {
                throw new HttpError(403);
            }
            return resource;
        });
    });
}