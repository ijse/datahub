var express = require('express');
var app = express();

var pluginLoader = require('./lib/pluginLoader');

// var EventEmitter = require('events').EventEmitter;
// var hub = new EventEmitter();

var hub = require('./lib/Hub');

var pluginMap = pluginLoader.load(app, hub);

app.set('plugins', pluginMap);

app.get('/', function (req, res) {
  res.send('Hello World!');

  hub.emit('plugin:ping:setGreeting', Date.now());
});

// initialize plugins
hub.emit('plugin-init');

var server = app.listen(3000, 'localhost', function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('dataHub app listening at http://%s:%s', host, port);

});
