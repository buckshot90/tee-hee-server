var Q = require('q');
var config = require('../config/index');
var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    created: {type: Date, default: Date.now},
    type: {type: String, required: true},
    url: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});


schema.methods.authorize = function (user) {
    var author = this.author;
    var id = user ? user._id.toString() : '';
    return author.role === 'admin' || author.role === 'manager' || id === author._id.toString();
};


schema.statics.create = function (id, userId, type, url) {
    var Resource = mongoose.model('Resource');
    var resource = new Resource({_id: id, author: userId, type: type, url: url});
    return Q.nbind(resource.save, resource)().then(function (results) {
        return results[0];
    });
};


schema.statics.qfind = function (params, fields, options) {
    var Resource = mongoose.model('Resource');
    return Q.nbind(Resource.find, Resource)(params, fields, options);
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
        delete ret.author;
        return ret;
    }
};

module.exports = mongoose.model('Resource', schema);