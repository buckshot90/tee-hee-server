var Q = require('q');
var crypto = require('crypto');
var config = require('../../config');
var mongoose = require('../../libs/mongoose');
var AuthError = require('../errors/authError');

var Schema = mongoose.Schema;


var schema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email address is not valid']
    },
    role: {type: String, enum: config.get('enums:roles'), default: 'user', required: true},
    hashedPassword: {type: String, required: true},
    salt: {type: String, required: true},
    created: {type: Date, default: Date.now},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

schema.virtual('password').set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._plainPassword;
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.authorize = function (accessLevel) {
    if (accessLevel == 'user') {
        return true;
    } else if (accessLevel === 'manager') {
        return this.role === 'admin' || this.role === 'manager';
    }
    return this.role === 'admin';
};

schema.statics.auth = function (username, password) {
    var User = mongoose.model('User');
    return User.qfindOne({$or: [{username: username}, {email: username}]}).then(function (user) {
        if (user && user.checkPassword(password)) {
            return user;
        }
        throw new AuthError('Invalid username or password');
    });
};

schema.statics.signUp = function (username, password, email) {
    var newUser = null;
    var User = mongoose.model('User');

    return User.qfindOne({username: username}).then(function (user) {
        if (user)throw new AuthError('User already exists');
        return User.qfindOne({email: email})
    }).then(function (user) {
        if (user)throw new AuthError('Email address already exists');
        newUser = new User({username: username, password: password, email: email});
        return Q.nbind(newUser.save, newUser)();
    }).then(function (results) {
        return results[0];
    });
};

schema.statics.qfind = function (params, fields, options) {
    var User = mongoose.model('User');
    return Q.nbind(User.find, User)(params);
};

schema.statics.qfindOne = function (params, fields, options) {
    var User = mongoose.model('User');
    return Q.nbind(User.findOne, User)(params, fields, options);
};

schema.statics.qfindById = function (id, fields, options) {
    var User = mongoose.model('User');
    return Q.nbind(User.findById, User)(id, fields, options);
};

schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.hashedPassword;
        delete ret.salt;
        return ret;
    }
};

module.exports = mongoose.model('User', schema);