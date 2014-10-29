var app = require('./app/app');
var config = require('./app/config/config');
var log = require('./app/libs/log')(module);

app.set('port', config.get('port'));

var server = app.listen(app.get('port'), function() {
    log.info('Express server listening on port ' + server.address().port);
});