var path = require('path');
var config = require('../config');

var API_VERSION = config.get('apiVersion');
var BASE_URL = '/api/' + API_VERSION;


module.exports = function (app) {
    app.get('/api', function (req, res) {
        res.redirect('/');
    });

    require('./' + API_VERSION + '/auth')(app, BASE_URL);
    require('./' + API_VERSION + '/users')(app, BASE_URL);

    require('./errors')(app);
};
