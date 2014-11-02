var controller = require('./../../controllers/upload');
var authFilters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    //private methods
    app.post(url + '/resources/upload',authFilters.checkAuth, controller.upload);
};

