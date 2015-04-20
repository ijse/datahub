
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Hub = new EventEmitter2({

  // use wildcards.
  wildcard: true,

  // the delimiter used to segment namespaces, defaults to `.`.
  delimiter: ':',

  // if you want to emit the newListener event set to true.
  newListener: false,

  // max listeners that can be assigned to an event, default 10.
  maxListeners: 20
});


Hub.onInit = function(cb) {
  Hub.once('plugin-init', cb);
}

Hub.onDestroy = function(cb) {
  Hub.once('destroy', cb);
}

Hub.applyPlugin = function(eventScope, initFn) {

  var _this = this;
  var prefix = eventScope.slice(0, eventScope.length-1).join(Hub.delimiter) + Hub.delimiter;

  function dispatchEvent() {
    var evt = this.event.replace(prefix, '');
    var args = Array.prototype.slice.call(arguments, 0);
    _this.emit.apply(_this, [evt].concat(args));
  }

  // init events
  Hub.once('plugin-init', initFn);

  // custome events
  Hub.on(eventScope, dispatchEvent);

  // cleaning events
  Hub.once('destroy', function() {
    _this.logger('Remove listeners and clean.');
    _this.destroy.call(_this, arguments);
    Hub.off(eventScope, dispatchEvent);
  });

}

module.exports = Hub;
