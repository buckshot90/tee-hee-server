var express = require('express');
var path = require('path');
var config = require('../config');

var ROUTES = config.get('routes');
var API_VERSION = config.get('apiVersion');
var BASE_URL = '/api/' + API_VERSION;

function parseRoute(reqUrl, route, controllers) {
    var router = express.Router();
    Object.keys(route).forEach(function (reqMethod) {
        var action = getControllerAction(route, reqMethod, controllers);
        router.route(reqUrl)[reqMethod](action);
    });
    return router;
}

function getControllerAction(route, reqMethod, controllers) {
    var ctrlStr = route[reqMethod].split('.')[0];
    var ctrlMethod = route[reqMethod].split('.')[1];

    if (!controllers[ctrlStr]) {
        var Ctrl = require(path.normalize(path.join('../controllers/', API_VERSION, ctrlStr)));
        controllers[ctrlStr] = new Ctrl();
    }

    return controllers[ctrlStr][ctrlMethod];
}

module.exports = function (app) {
    var controllers = {};

    Object.keys(ROUTES[API_VERSION]).forEach(function (reqUrl) {
        var route = ROUTES[API_VERSION];
        app.use(BASE_URL, parseRoute(reqUrl, route[reqUrl], controllers));
    });
};