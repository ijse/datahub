#!/usr/bin/env node

var config = require('./configs');
var exec = require('child_process').exec;

var resolve = require('path').resolve;
var pluginDir = config.pluginDir;

var pluginName = process.argv[2];

var fullName = 'datahub-plugin-' + pluginName;

exec('npm install ' + fullName, function(e, so, se) {
  if(e) throw e;

  if(pluginDir) {
    exec('mv -v ./node_modules/' + fullName + ' ' + resolve(pluginDir + '/' + pluginName));
  }
});

