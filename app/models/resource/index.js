var Q = require('q');
var crypto = require('crypto');
var config = require('../../config');
var mongoose = require('../../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    url: {type: String, unique: true, required: true},
    created: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

schema.statics.qfind = function (params, fields, options) {
    var Resource = mongoose.model('Resource');
    return Q.nbind(Resource.find, Resource)(params);
};

schema.statics.qfindOne = function (params, fields, options) {
    var Resource = mongoose.model('Resource');
    return Q.nbind(Resource.findOne, Resource)(params, fields, options);
};

schema.statics.qfindById = function (id, fields, options) {
    var Resource = mongoose.model('Resource');
    return Q.nbind(Resource.findById, Resource)(id, fields, options);
};

schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Resource', schema);