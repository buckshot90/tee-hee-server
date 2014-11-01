var controller = require('./../../controllers/upload/index');

module.exports = function (app, url) {
    app.post(url + '/upload', controller.save);
};

