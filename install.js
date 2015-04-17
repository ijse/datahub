#!/usr/bin/env node

var exec = require('child_process').exec;

var plugName = process.argv[2];
exec('npm install datahub-plugin-' + plugName, function(e, so, se) {
  if(e) throw e;
  console.log(so || se);
});

