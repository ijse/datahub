var log = require('debug')('datahub:main');

var express = require('express');

function Server(config) {

  var pluginLoader = require('./pluginLoader');
  var hub = require('./Hub');

  var app = express();

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

  return app;

}

module.exports = Server;
