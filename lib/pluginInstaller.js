
var config = require('../configs');
var exec = require('child_process').exec;
var log = require('debug')('datahub:plugin');

var resolve = require('path').resolve;
var join = require('path').join;

var pluginDir = config.pluginDir;
var moduleDir = join(__dirname, '../node_modules');

exports.install = function(pluginName) {
  var fullName = 'datahub-plugin-' + pluginName;
  log('install plugin ' + fullName);
  exec('npm install ' + fullName, function(e, so, se) {
    if(e) throw e;

    if(pluginDir) {
      var cmd = 'mv -v ' + moduleDir + '/' + fullName + '/ ' + resolve(pluginDir + '/' + pluginName);
      log('move plugin to plugin directory: ', cmd);
      exec(cmd);
    }
  });

}
