
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

var EventEmitter = EventEmitter2.bind(null, {
  wildcard: true,
  delimiter: ':',
  newListener: false,
  maxListeners: 20
});

function BasePlugin() {
  // defer bind default error handler
  setImmediate(function () {
    if (!this.listeners('error').length) {
      /**
       * default error handler
       */
      this.on('error', this.defaultErrorHandler.bind(this));
    }
  }.bind(this));
  EventEmitter.call(this);
}
BasePlugin.prototype = new EventEmitter();
// util.inherits(BasePlugin, EventEmitter);

BasePlugin.create = function(name, func, defaultConfig) {
  name = name.toLowerCase();
  function fn(settings, hub, router, debug) {
    BasePlugin.call(this);
    var thisfn = this;
    var eventScope = ['plugin', name, '*'];

    // Attach router
    thisfn.route = router;
    thisfn.logger = debug;

    // dispatch events for this plugin
    // and set destroy events
    hub.applyPlugin.call(thisfn, eventScope, func.bind(thisfn, settings));
  }
  // copy from BasePlugin prototype
  util.inherits(fn, BasePlugin);

  // merge func prototype
  util._extend(fn.prototype, func.prototype);

  fn.config = defaultConfig;

  return fn;
}
BasePlugin.prototype.destroy = function() {}
BasePlugin.prototype.defaultErrorHandler = function (err) {
  console.error('\n[%s][pid: %s][%s][%s] %s: %s \nError Stack:\n  %s',
    Date(), process.pid, this.constructor.name, __filename, err.name,
    err.message, err.stack);

  // try to show addition property on the error object
  // e.g.: `err.data = {url: '/foo'};`
  var additions = [];
  for (var key in err) {
    if (key === 'name' || key === 'message') {
      continue;
    }

    additions.push(util.format('  %s: %j', key, err[key]));
  }
  if (additions.length) {
    console.error('Error Additions:\n%s', additions.join('\n'));
  }
  console.error();
  throw err;
};

module.exports = BasePlugin;
