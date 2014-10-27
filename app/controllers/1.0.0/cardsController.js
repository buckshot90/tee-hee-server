var _base = require('./_base');

function CardsController() {
    _base.apply(this, arguments);

    this.index = function (req, res, next) {
        res.send({method: 'index'});
    };

    this.card = function (req, res, next) {
        res.send({
            method: 'card',
            req: {
                params: req.params
            }
        });
    };

    this.create = function (req, res, next) {
        next(new Error('not implemented'));
    };

    this.update = function (req, res, next) {
        next(new Error('not implemented'));
    };

    this.remove = function (req, res, next) {
        next(new Error('not implemented'));
    };
}

module.exports = CardsController;