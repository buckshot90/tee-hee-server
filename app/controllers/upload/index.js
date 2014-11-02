var fs = require('fs');
var Q = require('q');
var ObjectID = require('mongodb').ObjectID;
var UploadError = require('../../models/errors/uploadError');
var HttpError = require('../../models/errors/httpError');

exports.save = function (req, res, next) {
    req.pipe(req.busboy);
    req.on('error', next);

    saveFile(req).then(function (result) {
        console.log(result);
        res.redirect('/upload');
    }, function (err) {
        if (err instanceof UploadError) {
            return next(new HttpError(400, err.message));
        }
        return next(err);
    });
};

function saveFile(req) {
    var defer = Q.defer();

    req.busboy.on('file', function (fieldname, fr, filename, encoding, mime) {
        console.log("file: " + fieldname, filename, mime);
        if (!isImage(mime)) {
            defer.reject(new UploadError('Wrong file type'));
        }
        var id = new ObjectID();
        var fw = fs.createWriteStream('./files/' + id);

        fr.pipe(fw);

        fr.on('error', defer.reject);
        fw.on('error', defer.reject);
        fw.on('finish', function () {
            defer.resolve({filename: filename, id: id});
        });
    });

    req.busboy.on('error', defer.reject);

    return defer.promise;
}



function isImage(mime) {
    return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/gif';
}
