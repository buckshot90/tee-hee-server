/**
 * Created by pov on 29.10.2014.
 */
var Q = require('q');
var mongoose = require('./utils/mongoose');
var log = require('./utils/log')(module);


var tasks = [connect, dropDataBase, requireModels, createUsers];
tasks.reduce(function (prev, task) {
    return prev.then(task);
}, Q(null)).catch(function (err) {
    log.error(err);
}).finally(disconnect);

function connect() {
    var defer = Q.defer();
    mongoose.connection.on('open', function () {
        console.log('Connected to mongo server.');
        defer.resolve();
    });
    return defer.promise;
}

function dropDataBase() {
    var db = mongoose.connection.db;
    return Q.nbind(db.dropDatabase, db)().then(function (data) {
        console.log('Drop database');
        return data;
    });
}

function requireModels() {
    require('./models/user');

    var tasks = Object.keys(mongoose.models).map(function (modelName) {
        return mongoose.models[modelName].ensureIndexes().then(function () {
            console.log('Index created');
        });
    });

    return Q.all(tasks);
}

function createUsers() {
    var users = [
        {username: 'oleg', password: '1'},
        {username: 'oleg', password: '2'},
        {username: 'admin', password: '123456'}
    ];

    var tasks = users.reduce(function (prev, user) {
        user = new mongoose.models.User(user);
        return prev.then(function () {
            return Q.ninvoke(user, 'save').then(function (results) {
                console.log('User created %s', results[0].username);
                return results[0];
            });
        });
    }, Q(null));

    return tasks;
}

function disconnect() {
    return Q.nbind(mongoose.disconnect, mongoose)().then(function () {
        console.log('Disconnected to mongo server');
    });
}


