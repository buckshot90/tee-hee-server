var app = require('./app');
var config = require('./config');
var log = require('./utils/log')(module);

app.set('port', config.get('port'));

var server = app.listen(app.get('port'), function() {
    log.info('Express server listening on port ' + server.address().port);
});