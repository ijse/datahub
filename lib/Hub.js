
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

module.exports = Hub;
