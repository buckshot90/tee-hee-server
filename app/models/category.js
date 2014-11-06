var Q = require('q');
var config = require('../config/index');
var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    created: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    label: {type: String, required: true},
    lang: {type: String, enum: config.get('enums:languages'), default: 'en', required: true},
    image: {type: Schema.Types.ObjectId, ref: 'Resource', default: null},
    isPublic: {type: Boolean, default: false, required: true}
    //cards:[]
});

schema.methods.authorize = function (user) {
    return this.isPublic || (user && user._id.toString() === this.author.toString());
};

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

schema.statics.qfindWithImage = function (params, fields, options) {
    var Category = mongoose.model('Category');
    var query = Category.find(params, fields, options).populate('image');
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