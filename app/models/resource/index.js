var Q = require('q');
var crypto = require('crypto');
var config = require('../../config');
var mongoose = require('../../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    created: {type: Date, default: Date.now},
    type: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});


schema.methods.authorize = function (user) {
    return user.role === 'admin' ||  this.author.role === 'admin' || user._id.toString() === this.author._id.toString();

};

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

schema.statics.qfindByIdWithAuthor = function (id, fields, options) {
    var Resource = mongoose.model('Resource');
    var query = Resource.findById(id, fields, options).populate('author');
    return Q.nbind(query.exec, query)();
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