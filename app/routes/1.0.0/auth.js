var controller = require('./../../controllers/auth');
var filters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    app.post(url + '/auth/login', controller.login);
    app.post(url + '/auth/logout', controller.logOut);
    app.post(url + '/auth/signUp', controller.signUp);
};
