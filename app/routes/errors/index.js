var controller = require('./../../controllers/1.0.0/errorController');

module.exports = function (app) {
    //catch Not Found errors
    app.use(controller.notFound);

    //log errors
    app.use(controller.logErrors);

    //send errors to client
    app.use(controller.catchAll);
};

