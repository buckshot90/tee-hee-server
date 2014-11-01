var path = require('path');
var config = require('../config');
var authFilters = requre('../controllers/auth/filters');

var API_VERSION = config.get('apiVersion');
var BASE_URL = '/api/' + API_VERSION;


module.exports = function (app) {
    app.get('/api', function (req, res) {
        res.redirect('/');
    });


    //public API methods
    requreRoute(app, '/auth');

    //private methods
    app.use(url + '/users', authFilters.checkAuth);
    requreRoute(app, '/users');

    //errors
    require('./errors')(app);
};

function requreRoute(app, path) {
    try {
        require('./' + API_VERSION + path)(app, BASE_URL);
    } catch (e) {
        require('./1.0.0' + path)(app, BASE_URL);
    }
}