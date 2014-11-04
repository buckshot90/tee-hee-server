var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;

var User = require('../../models/user');
var Resource = require('../../models/resource');

var config = require('../../config/index');
var HttpError = require('../../models/errors/httpError');
var UploadError = require('../../models/errors/uploadError');
var ValidationError = require('../../models/errors/validationError');

var IMAGES_MIMES = config.get('upload:mimes:images');
var REPOSITORY_PATH = config.get('upload:path');

fs.exists(REPOSITORY_PATH, function (exists) {
    if (!exists)fs.mkdir(REPOSITORY_PATH, function (err) {
        if (err) throw err;
    });
});

exports.filters={};

exports.upload = function (req, res, next) {
    readUploadRequest(req).then(function (resources) {
        res.send({resources: resources});
    }, function (err) {
        if (err instanceof UploadError) {
            return next(new HttpError(400, err.message));
        } else if (err instanceof  ValidationError) {
            if (_.isObject(err.errors)) {
                var first = err.errors[Object.keys(err.errors)[0]] || {};
                return next(new HttpError(400, first.message));
            }
            return next(new HttpError(400, err.message));
        }
        next(err);
    });
};

exports.getById = function (req, res, next) {
    if (User.authorize('manager', req.currentUser) || req.resource.authorize(req.currentUser)) {
        res.header('Content-Type', req.resource.type);
        sendResource(req.resource, res, next);
    } else {
        throw new HttpError(403);
    }
};

exports.filters.mapModel = function (req, res, next) {
    Q(req).then(function (req) {
        try {
            return new ObjectID(req.params.id);
        } catch (e) {
            throw new HttpError(404, 'Resource Not Found');
        }
    }).then(Resource.qfindByIdWithAuthor).then(function (resource) {
        if (!resource)throw new HttpError(404, 'Resource Not Found');
        req.resource = resource;
        next();
    }).catch(next);
};


function sendResource(resource, responce, next) {
    var filePath = path.normalize(path.join(REPOSITORY_PATH, resource._id.toString()));
    fs.exists(filePath, function (exists) {
        if (exists) {
            var file = new fs.ReadStream(filePath);
            file.pipe(responce);
            file.on('error', next);
            responce.on('close', function () {
                file.destroy();
            });
        } else {
            next(404);
        }
    });
}

function readUploadRequest(req) {
    var defer = Q.defer();

    var resources = [];
    var filesCount = 0;

    req.pipe(req.busboy);

    req.busboy.on('file', function onFile(fieldname, stream, filename, encoding, mime) {
        filesCount++;
        console.log(defer.promise.inspect());

        if (!defer.promise.isRejected()) {

            if (!isImage(mime)) {
                defer.reject(new UploadError('Wrong MIME type'));
                return;
            }

            saveFile(stream).then(function (id) {
                return Resource.create(id, req.currentUser._id, mime);
            }).then(function (resource) {
                resources.push(resource);
                if (resources.length === filesCount) {
                    defer.resolve(resources);
                }
            }).catch(defer.reject);
        }
    });

    req.busboy.on('error', defer.reject);

    return defer.promise;
}

function saveFile(stream) {
    var defer = Q.defer();

    var id = (new ObjectID()).toString();
    var savePath = path.normalize(path.join(REPOSITORY_PATH, id));
    var sw = fs.createWriteStream(savePath);

    stream.pipe(sw);

    stream.on('error', defer.reject);

    sw.on('error', defer.reject);

    sw.on('finish', function () {
        defer.resolve(id);
    });

    return defer.promise;
}

function isImage(mime) {
    return IMAGES_MIMES.indexOf(mime) != -1;
}
