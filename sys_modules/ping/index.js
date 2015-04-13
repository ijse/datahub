
function Ping(config, hub, router) {

  var greeting = config.greeting;

  hub.once('plugin-init', function(event) {

    router.get('/', function(req, res) {
      res.end('Pong! ' + greeting + '\n');
    });

  });

  hub.on('plugin:ping:*', function(txt) {
    greeting = txt;

    console.log('greeting set to ', txt);
  });

}

Ping.prototype.destroy = function() {
  // release resources
}

module.exports = Ping;
