var util = require('util');

function UploadError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, UploadError);
    this.message = message;
}

util.inherits(UploadError, Error);
UploadError.prototype.name = "UploadError";

module.exports = UploadError;