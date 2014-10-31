var controller = require('./../../controllers/users');
var usersFilters = require('./../../controllers/users/filters');
var authFilters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    app.get(url + '/users', controller.list);
    app.use(url + '/users/:id', usersFilters.mapModel);
    app.get(url + '/users/:id', controller.user);
};

