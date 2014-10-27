var crypto = require('crypto');
var mongoose = require('../utils/mongoose');
var config = require('../config');

var Schema = mongoose.Schema;


var schema = new Schema({
    label: {type: String, required: true},
    lang: {type: String, enum: config.get('enums:languages'), required: true},
    creator: {type: Schema.ObjectId, required: true, ref: 'User'},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Category', schema);
