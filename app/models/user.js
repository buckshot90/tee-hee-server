var crypto = require('crypto');
var mongoose = require('../utils/mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    username: {type: String, unique: true, required: true},
    hashedPassword: {type: String, required: true},
    salt: {type: String, required: true},
    created: {type: Date, default: Date.now},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.virtual('password').set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._plainPassword;
});

module.exports = mongoose.model('User', schema);