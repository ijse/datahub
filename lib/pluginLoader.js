//
// Find and load modules
//
var fs = require('fs');
var join = require('path').join;
var config = require('../configs');

var Router = require('express').Router;

/**
 * find plugins in node_modules
 *   with name prefixed 'datahub-plugin-'
 * @return {array} result
 */
function findPlugins() {
  var dir = join(__dirname, '../node_modules');

  var list = fs.readdirSync(dir);

  var result = list.filter(function(item) {
    return /^datahub-plugin-/.test(item);
  });

  return result;
}

/**
 * load plugins and assign router
 *   /{plugin-name}/**
 * @param  {object} app express instance
 * @param  {object} hub EventEmitter instance
 * @return {object}     plugins map object
 */
exports.load = function(app, hub) {
  var pluginList = findPlugins();
  var pluginMap = {};

  pluginList.forEach(function(mod) {

    var modName = mod.replace(/^datahub-plugin-/, '');
    var settings = config.plugin[modName] || {};

    var Plugin = require(mod);
    var router = Router();
    app.use('/' + modName, router);

    pluginMap[modName] = new Plugin(settings, hub, router);
  });

  return pluginMap;
}
