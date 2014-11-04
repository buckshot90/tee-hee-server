var Q = require('q');
var crypto = require('crypto');
var config = require('../config/index');
var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    created: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    label: {type: String, required: true},
    lang: {type: String, enum: config.get('enums:languages'), default: 'en', required: true},
    image: {type: Schema.Types.ObjectId, ref: 'Resource'},
    accessType: {type: String, enum: config.get('enums:accessTypes'), default: 'private', required: true}
    //cards:[]
});


schema.statics.create = function (params) {
    var Category = mongoose.model('Category');
    var category = new Category(params);
    return Q.nbind(category.save, category)().then(function (results) {
        return results[0];
    });
};

schema.statics.qfind = function (params, fields, options) {
    var Category = mongoose.model('Category');
    return Q.nbind(Category.find, Category)(params, fields, options);
};

schema.statics.qfindOne = function (params, fields, options) {
    var Category = mongoose.model('Category');
    return Q.nbind(Category.findOne, Category)(params, fields, options);
};

schema.statics.qfindById = function (id, fields, options) {
    var Category = mongoose.model('Category');
    return Q.nbind(Category.findById, Category)(id, fields, options);
};

schema.statics.qfindByIdWithAuthor = function (id, fields, options) {
    var Category = mongoose.model('Category');
    var query = Category.findById(id, fields, options).populate('author');
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

module.exports = mongoose.model('Category', schema);