var path = require('path');
var config = require('../config');

var API_VERSION = config.get('apiVersion');
var BASE_URL = '/api/' + API_VERSION;


module.exports = function (app) {
    app.get('/api', function (req, res) {
        res.redirect('/');
    });

    requreRoute(app, '/auth');
    requreRoute(app, '/users');

    require('./errors')(app);
};

function requreRoute(app, path) {
    try {
        require('./' + API_VERSION + path)(app, BASE_URL);
    } catch (e) {
        require('./1.0.0' + path)(app, BASE_URL);
    }
}