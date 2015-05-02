//
// Find and load modules with proper settings
//
var fs = require('fs');
var join = require('path').join;
var config = require('../configs');
var Debug = require('debug');
var log = Debug('datahub:plugin');
var merge = require('util')._extend;

var Router = require('express').Router;
var BasePlugin = require('./BasePlugin');

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
exports.load = function(app, config, hub) {
  var pluginList = findPlugins();
  var pluginMap = {};

  log('Found %s plugin%s to load.', pluginList.length, pluginList.length>1?'s':'');
  pluginList.forEach(function(mod) {

    var modName = mod.replace(/^datahub-plugin-/, '');
    var debug = Debug('datahub:plugin:' + modName)

    var settings = (config.plugin && config.plugin[modName]) || {};

    log('Load plugin %s as name "%s"', mod, modName);

    // prepare router
    var router = Router();
    app.use('/' + modName, router);

    var PluginSrc = require(mod);
    log('Default settings for %s:%o', modName, PluginSrc.config);
    log('Reading settings for %s:%o', modName, settings);

    settings = merge(PluginSrc.config, settings);

    log('Apply settings for %s:%o', modName, settings);

    var Plugin = BasePlugin.create(modName, PluginSrc, settings);

    pluginMap[modName] = new Plugin(settings, hub, router, debug);
  });

  log('Finish load plugins.');
  return pluginMap;
}
