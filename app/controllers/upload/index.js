var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var config = require('../../config');
var Resource = require('../../models/resource');
var HttpError = require('../../models/errors/httpError');
var UploadError = require('../../models/errors/uploadError');
var ValidationError = require('../../models/errors/validationError');

var IMAGES_MIMES = config.get('upload:mimes:images');

exports.upload = function (req, res, next) {

    readRequest(req).then(function (resources) {
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

function readRequest(req) {
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
                //TO DO: cleanup files and recodrs in db from resources array
                return;
            }

            saveFile((new ObjectID()).toString(), stream).then(function (url) {
                console.log('CREATE RESOURCE %s %s', url, filename);
                return createResource(url, req.session.user);
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

function saveFile(name, stream) {
    var defer = Q.defer();

    var url = path.normalize(path.join('./files/', name));
    var sw = fs.createWriteStream(url);

    stream.pipe(sw);

    stream.on('error', defer.reject);

    sw.on('error', defer.reject);

    sw.on('finish', function () {
        defer.resolve(url);
    });

    return defer.promise;
}

function createResource(url, userId) {
    var resource = new Resource({url: url, author: userId});
    return Q.nbind(resource.save, resource)().then(function (results) {
        return results[0];
    });
}

function isImage(mime) {
    return IMAGES_MIMES.indexOf(mime) != -1;
}
