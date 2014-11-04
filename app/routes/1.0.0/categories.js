var controller = require('./../../controllers/1.0.0/categoriesController');
var categoryFilters = require('./../../controllers/1.0.0/categoriesController').filters;

module.exports = function (app, url) {
    app.get(url + '/categories', controller.list);
    app.use(url + '/categories/:id', categoryFilters.mapModel);
    app.get(url + '/categories/:id', controller.category);
};

