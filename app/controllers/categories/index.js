var Category = require('../../models/category/index');

exports.list = function (req, res, next) {
    Category.qfind({}).then(function (categories) {
        res.send(categories);
    }, next);
};

exports.category = function (req, res, next) {
    res.send(req.category);
};


