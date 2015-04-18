var log = require('debug')('datahub:main');

var express = require('express');
var app = express();

var pluginLoader = require('./lib/pluginLoader');

var hub = require('./lib/Hub');

var pluginMap = pluginLoader.load(app, hub);

app.set('plugins', pluginMap);

app.get('/', function (req, res) {
  res.send('Hello World!');

  hub.emit('plugin:ping:setGreeting', Date.now());
});

// list all plugins as json
app.get('/plugins', function(req, res) {
  res.json(pluginMap);
});

// initialize plugins
hub.emit('plugin-init');

var server = app.listen(3000, 'localhost', function () {

  var host = server.address().address;
  var port = server.address().port;

  log('Listening at http://%s:%s', host, port);

});

function onExit() {
  hub.emit('destroy');
  server.close();
  // hub.emit.apply(hub.emit, ['destroy'].concat(arguments) );
}
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
// process.on('uncaughtException', onExit);

