var controller = require('./../../controllers/resources');
var resourceFilters = require('../../controllers/resources/filters');
var authFilters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    //public methods
    app.get(url + '/resources/:id', authFilters.authenticate, resourceFilters.mapModel, controller.getById);

    //private methods
    app.post(url + '/resources/upload', authFilters.authorize('user'), controller.upload);
};

