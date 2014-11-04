var controller = require('./../../controllers/1.0.0/resourcesController');
var resourceFilters = require('../../controllers/1.0.0/resourcesController').filters;
var authFilters = require('../../controllers/1.0.0/authController').filters;

module.exports = function (app, url) {
    //public methods
    app.get(url + '/resources/:id', authFilters.authenticate, resourceFilters.mapModel, controller.getById);

    //private methods
    app.post(url + '/resources/upload', authFilters.authorize('user'), controller.upload);
};

