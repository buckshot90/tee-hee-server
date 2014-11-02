/**
 * Created by pov on 29.10.2014.
 */
var Q = require('q');
var mongoose = require('./libs/mongoose');
var log = require('./libs/log')(module);

//mongoose.set('debug', true);


run([connect, dropDataBase, requireModels, createUsers]).then(function (users) {
    console.log("Count of users: %d", users.length);
}).catch(function (err) {
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
    return Q.ninvoke(db, 'dropDatabase').then(function (data) {
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
        {username: 'oleg', password: '1', email:'oleg@teehee.com', role: 'manager'},
        {username: 'vitaliy', password: '2', email:'vitaliy@teehee.com'},
        {username: 'admin', password: '123456', email:'admin@teehee.com', role: 'admin'}
    ];

    var usersCreated = [];
    var tasks = users.reduce(function (prev, user) {
        user = new mongoose.models.User(user);
        return prev.then(function () {
            return Q.ninvoke(user, 'save').then(function (results) {
                var user = results[0];
                usersCreated.push(user);
                console.log('User created %s', user.username);
                return results[0];
            });
        });
    }, Q(null));

    return tasks.then(function () {
        return usersCreated;
    });
}

function disconnect() {
    return Q.ninvoke(mongoose, 'disconnect').then(function () {
        console.log('Disconnected to mongo server');
    });
}

function run(tasks) {
    return tasks.reduce(function (prev, task) {
        return prev.then(task);
    }, Q(null));
}