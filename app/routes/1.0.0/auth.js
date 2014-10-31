var controller = require('./../../controllers/auth');

module.exports = function (app, url) {
    app.post(url + '/login', controller.login);
    app.post(url + '/signUp', controller.signUp);
};
