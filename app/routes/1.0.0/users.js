var controller = require('./../../controllers/1.0.0/usersController');
var usersFilters = require('./../../controllers/1.0.0/usersController').filters;
var authFilters = require('../../controllers/1.0.0/authController').filters;

module.exports = function (app, url) {
    //private methods
    app.use(url + '/users', authFilters.authorize('manager'));

    app.get(url + '/users', controller.list);
    app.use(url + '/users/:id', usersFilters.mapModel);
    app.get(url + '/users/:id', controller.user);
};

