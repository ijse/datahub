
var config = require('./configs');

var app = require('./lib/server');

app.set('server', app.listen(config.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n\t====================================');
  console.log('\tListening at http://%s:%s', host, port);
  console.log('\t====================================\n');

}));

