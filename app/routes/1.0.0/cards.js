var controller = require('./../../controllers/1.0.0/cardsController');
var cardsFilters = require('./../../controllers/1.0.0/cardsController').filters;
var authFilters = require('../../controllers/1.0.0/authController').filters;

module.exports = function (app, url) {
    //public methods
    app.get(url + '/categories/:lang/:id/', controller.list);
    app.use(url + '/categories/:lang/:id/:cid', cardsFilters.mapModel);
    app.get(url + '/categories/:lang/:id/:cid', controller.card);

    //priivate methods
    app.post(url + '/categories/:lang/:id/', authFilters.authorize('user'), controller.create);
    app.put(url + '/categories/:lang/:id/:cid', authFilters.authorize('user'), controller.edit);
    app.delete(url + '/categories/:lang/:id/:cid', authFilters.authorize('user'), controller.remove);
};

