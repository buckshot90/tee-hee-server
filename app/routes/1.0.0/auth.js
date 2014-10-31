var controller = require('./../../controllers/auth');
var filters = require('../../controllers/auth/filters');

module.exports = function (app, url) {
    //restore user from session
    app.use(url, filters.setCurrentUser);


    //public methods
    app.post(url + '/login', controller.login);
    app.post(url + '/signUp', controller.signUp);


    //private methods
    app.use(url + '/users', filters.checkAuth);
};
