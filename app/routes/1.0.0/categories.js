var controller = require('./../../controllers/categories');
var usersFilters = require('./../../controllers/categories/filters');

module.exports = function (app, url) {
    app.get(url + '/categories', controller.list);
    app.use(url + '/categories/:id', usersFilters.mapModel);
    app.get(url + '/categories/:id', controller.category);
};

