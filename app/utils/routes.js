var express = require('express');
var path = require('path');
var config = require('../config/index');

var ROUTES = config.get('routes');
var API_VERSION = config.get('apiVersion');
var BASE_URL = '/api/' + API_VERSION;

function parseRoute(router, reqUrl, route, controllers) {
    Object.keys(route).forEach(function (reqMethod) {
        var method = getControllerMethod(route, reqMethod, controllers);
        router.route(reqUrl)[reqMethod](method);
    });
}

function getControllerMethod(route, reqMethod, controllers) {
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
    Object.keys(ROUTES[API_VERSION]).map(function (reqUrl) {
        var erouter = express.Router();
        var route = ROUTES[API_VERSION];
        parseRoute(erouter, reqUrl, route[reqUrl], controllers);
        return erouter;
    }).forEach(function (erouter) {
        app.use(BASE_URL, erouter);
    });
};