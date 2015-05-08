

/**
 * Default plugin configs
 *   read by pluginLoader for initializing the plugin
 *
 * @type {object}
 */
Ping.config = require('./config');

/**
 * Plugin Object
 *
 * this.route:
 *     `express.Router()` instance under the url path `/{pluginName}`
 *
 * this.logger:
 *     function to output debug messages
 *
 * @param {object} config plugin configurations
 */
function Ping(config) {

  // this.on('error', function(e) {
  //   console.log(e);
  // });

  // custom plugin attribute
  this.greeting = config.greeting;

  this.route.get('/', function(req, res) {
    res.end('Pong! ' + this.greeting + '\n');
  }.bind(this));

  // custom plugin listener
  //  for all messages under the scope of `plugin:{pluginName}:*`
  //
  // eg.:
  //
  // ```
  //    hub.emit('plugin:ping:setGreeting', 'hello');
  // ```
  //
  // which will be observed by:
  //
  // ```
  //    this.on('setGreeting', function(greeting) { ... });
  // ```
  //
  // Wildcards and scopes are avaliable. The delimiter is `:`.
  // The event name 'echo:*' is valid for `.emit('plugin:ping:echo:somebody')`.
  // And `*` is to match any.
  //
  this.on('*', function(txt) {
    // each message sended to me
    this.greeting = txt;

    this.logger('the greeting is set to %s', txt);
  }.bind(this));

  this.on('testError', function() {
    // throw new Error('boom');
    var er = new Error('boom');
    er.name = "testError";
    er.data = { test: 'name' };
    this.emit('error', er);
  }.bind(this));

}

/**
 * Override method
 *   called when plugin destroied
 */
Ping.prototype.destroy = function() {
  this.logger('destroy ping plugin', arguments);
};

/**
 * Custom method
 */
Ping.prototype.ping = function() {
  this.logger('-->', arguments);
};


module.exports = Ping;