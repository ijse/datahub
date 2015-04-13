
function Ping(config, hub, router) {


  hub.once('plugin-init', function(event) {

    router.get('/', function(req, res) {
      res.end('Pong!' + config.greeting);
    });

  });

}

Ping.prototype.destroy = function() {
  // release resources
}

module.exports = Ping;