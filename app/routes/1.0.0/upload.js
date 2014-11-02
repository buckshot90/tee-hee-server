var controller = require('./../../controllers/upload');

module.exports = function (app, url) {
    app.post(url + '/upload', controller.save);
};

