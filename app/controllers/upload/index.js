var fs = require('fs');
var Q = require('q');
var _ = require('underscore');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var Resource = require('../../models/resource');
var UploadError = require('../../models/errors/uploadError');
var ValidationError = require('../../models/errors/validationError');
var HttpError = require('../../models/errors/httpError');
var config = require('../../config');

var FILES_LIMIT = config.get('busboy:limits:files');

exports.upload = function (req, res, next) {
    readRequest(req).then(function (resources) {
        res.send({resources: resources});
    }, next);

};

function readRequest(req) {
    var defer = Q.defer();

    var resources = [];

    req.pipe(req.busboy);

    var emit = req.busboy.emit;
    req.busboy.emit = function (name) {
        console.log(name);
        return emit.apply(req.busboy, arguments);
    };

    req.busboy.on('file', function onFile(fieldname, stream, filename, encoding, mime) {
        console.log("file: " + fieldname, filename, mime);

        if (!isImage(mime)) {
            throw new UploadError('Wrong MIME type');
        }

        saveFile((new ObjectID()).toString(), stream).then(function (url) {
            return createResource(url, req.session.user);
        }).then(function (resource) {
            console.log(resource);
            resources.push(resource);
            if(resources.length >= FILES_LIMIT){
                defer.resolve(resources);
                req.busboy.removeListener('file', onFile);
            }
        }).catch(defer.reject);
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
    return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/gif';
}
