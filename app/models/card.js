var Q = require('q');
var config = require('../config/index');
var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    created: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    label: {type: String, required: true},
    image: {type: Schema.Types.ObjectId, ref: 'Resource', default: null},
    audio: {type: Schema.Types.ObjectId, ref: 'Resource', default: null}
});

schema.methods.authorize = function (user) {
    return user && user._id.toString() === this.author.toString();
};


schema.statics.create = function (params) {
    var Card = mongoose.model('Card');
    var card = new Card(params);
    return Q.nbind(card.save, card)().then(function (results) {
        return results[0];
    });
};

schema.statics.qfind = function (params, fields, options) {
    var Card = mongoose.model('Card');
    return Q.nbind(Card.find, Card)(params, fields, options);
};

schema.statics.qfindOne = function (params, fields, options) {
    var Card = mongoose.model('Card');
    return Q.nbind(Card.findOne, Card)(params, fields, options);
};

schema.statics.qfindById = function (id, fields, options) {
    var Card = mongoose.model('Card');
    return Q.nbind(Card.findById, Card)(id, fields, options);
};

schema.statics.qfindAndPopulate = function (params, popParams) {
    var Card = mongoose.model('Card');
    var query = Card.find(params).populate(popParams);
    return Q.nbind(query.exec, query)();
};


schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.author;
        //delete ret.category;
        return ret;
    }
};

module.exports = mongoose.model('Card', schema);