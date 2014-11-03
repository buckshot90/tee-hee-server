var controller = require('./../../controllers/resources');
var authFilters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    app.use(url + '/resources/', authFilters.checkAuth);

    //private methods
    app.post(url + '/resources/upload', controller.upload);
    app.get(url + '/resources/:id', controller.getById);
};

