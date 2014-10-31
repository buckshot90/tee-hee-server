var controller = require('./../../controllers/users');
var usersFilters = require('./../../controllers/users/filters');
var authFilters = require('../../controllers/auth/filters');

module.exports = function (app, url) {

    app
        .use(url + '/users', authFilters.checkAuth)
        .get(url + '/users', controller.list)
        .use(url + '/users/:id', usersFilters.mapUserModel)
        .get(url + '/users/:id', controller.user);
};

