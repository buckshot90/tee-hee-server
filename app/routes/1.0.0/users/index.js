var controller = require('./users');

module.exports = function (app, url) {
    app.get(url + '/users', controller.list);
    app.get(url + '/users/:id', controller.getById);
};

