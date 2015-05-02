require("babel/register");
var config = require('./configs');

var app = require('./lib/server')(config);

app.set('server', app.listen(config.port, function () {

  var host = this.address().address;
  var port = this.address().port;

  console.log('\n\t====================================');
  console.log('\tListening at http://%s:%s', host, port);
  console.log('\t====================================\n');

}));

/**
 * When exit, do some cleanning
 */
function onExit() {
  console.log();
  app.get('hub').emit('destroy');
  var server = app.get('server');
  try{
    server.close();
  } catch(e) {}
}
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
// process.on('uncaughtException', onExit);
