var controller = require('./../../controllers/1.0.0/authController');

module.exports = function (app, url) {
    app.post(url + '/auth/login', controller.login);
    app.post(url + '/auth/logout', controller.logOut);
    app.post(url + '/auth/signUp', controller.signUp);
};
