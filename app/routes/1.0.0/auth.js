var controller = require('./../../controllers/auth');
var filters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    //public methods
    app.post(url + '/login', controller.login);
    app.post(url + '/logout', controller.logOut);
    app.post(url + '/signUp', controller.signUp);

    //restore user from session
    app.use(url, filters.setCurrentUser);

    //private methods
    app.use(url + '/users', filters.checkAuth);
};
