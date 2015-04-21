var log = require('debug')('datahub:main');

var express = require('express');
var app = express();

var pluginLoader = require('./pluginLoader');

var hub = require('./Hub');

var pluginMap = pluginLoader.load(app, hub);

app.set('plugins', pluginMap);
app.set('hub', hub);

app.get('/', function (req, res) {
  res.send('Hello DataHub!');
});

// list all plugins as json
//  as formated plugin name is the key name and plugin data is the value
app.get('/plugins', function(req, res) {
  res.json(pluginMap);
});

// initialize plugins
hub.emit('plugin-init');

module.exports = app;


/**
 * When exit, do some cleanning
 */
function onExit() {
  console.log();
  hub.emit('destroy');
  var server = app.get('server');
  try{
    server.close();
  } catch(e) {}
}
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
// process.on('uncaughtException', onExit);
