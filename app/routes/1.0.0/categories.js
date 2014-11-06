var controller = require('./../../controllers/1.0.0/categoriesController');
var categoryFilters = require('./../../controllers/1.0.0/categoriesController').filters;
var authFilters = require('../../controllers/1.0.0/authController').filters;

module.exports = function (app, url) {
    app.use(url + '/categories/:lang/', categoryFilters.checkLang);

    //public methods
    app.get(url + '/categories/:lang/', controller.list);
    app.use(url + '/categories/:lang/:id', categoryFilters.mapModel);
    app.get(url + '/categories/:lang/:id', controller.category);

    //priivate methods
    app.post(url + '/categories/:lang/', authFilters.authorize('user'), controller.create);
    app.put(url + '/categories/:lang/:id', authFilters.authorize('user'), controller.edit);
    app.delete(url + '/categories/:lang/:id', authFilters.authorize('user'), controller.remove);

    require('./cards')(app, url);
};

