var log = require('debug')('datahub:main');

var express = require('express');
var app = express();

var config = require('./configs');

var pluginLoader = require('./lib/pluginLoader');

var hub = require('./lib/Hub');

var pluginMap = pluginLoader.load(app, hub);

app.set('plugins', pluginMap);

app.get('/', function (req, res) {
  res.send('Hello World!');

  hub.emit('plugin:ping:setGreeting', Date.now());
});

// list all plugins as json
//  as formated plugin name is the key name and plugin data is the value
app.get('/plugins', function(req, res) {
  res.json(pluginMap);
});

// initialize plugins
hub.emit('plugin-init');

var server = app.listen(config.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n\t====================================');
  console.log('\tListening at http://%s:%s', host, port);
  console.log('\t====================================\n');

});

function onExit() {
  console.log();
  hub.emit('destroy');
  try {
    server.close();
  } catch(e) {}
}
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
// process.on('uncaughtException', onExit);

