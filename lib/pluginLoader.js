//
// Find and load modules with proper settings
//
var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var config = require('../configs');
var Debug = require('debug');
var log = Debug('datahub:plugin');
var merge = require('util')._extend;

var Router = require('express').Router;
var BasePlugin = require('./BasePlugin');

/**
 * load plugins and assign router
 *   /{plugin-name}/**
 * @param  {object} app express instance
 * @param  {object} hub EventEmitter instance
 * @return {object}     plugins map object
 */
exports.load = function(app, config, hub) {
  var pluginMap = {};

  var pluginDir = resolve(config.pluginDir);
  var pluginList = fs.readdirSync(pluginDir);

  // filter only directories
  pluginList = pluginList.filter(function(item) {
    var dir = join(pluginDir, item);
    return fs.statSync(dir).isDirectory();
  });

  // plugin directory name has prefix of 'datahub-plugin-'
  if(config.pluginDir === 'node_modules') {
    pluginList = pluginList.filter((item)=> /^datahub-plugin-/.test(item));
  }

  // parse plugin info
  pluginList = pluginList.map(function(item) {

    var pluginSettings = config.plugin;
    var r = {};

    r.fullname = item;
    r.name = item.replace(/^datahub-plugin-/, '');
    r.path = join(pluginDir, item);
    r.settings = pluginSettings[r.name];

    return r;
  });

  log('Found %s plugin%s to load.', pluginList.length, pluginList.length>1?'s':'');
  pluginList.forEach(function(plugin) {

    // var modName = mod.replace(/^datahub-plugin-/, '');
    var debug = Debug('datahub:plugin:' + plugin.name);

    var settings = plugin.settings;

    log('Load plugin %s as name "%s"', plugin.fullname, plugin.name);

    // prepare router
    var router = Router();
    app.use('/' + plugin.name, router);

    var PluginSrc = require(plugin.path);
    log('Default settings for %s:%o', plugin.name, PluginSrc.config);
    log('Reading settings for %s:%o', plugin.name, settings);

    settings = merge(PluginSrc.config, settings);

    log('Apply settings for %s:%o', plugin.name, settings);

    var Plugin = BasePlugin.create(plugin.name, PluginSrc, settings);

    pluginMap[plugin.name] = new Plugin(settings, hub, router, debug);
  });

  log('Finish load plugins.');
  return pluginMap;
}
