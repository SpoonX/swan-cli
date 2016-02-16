var username  = require('./config').git.user.name;
var path      = require('path');
var fs        = require('fs');
var mkdirp    = require('mkdirp');
var SimpleGit = require('simple-git');

module.exports = function executeNew(options) {
  mkdirp.sync(options.path);
  process.chdir(options.path);
  fs.mkdirSync('project');

  var simpleGit = SimpleGit(process.cwd);

  simpleGit.init();

  fs.mkdirSync('server');
  fs.mkdirSync('client');

  mkdirp.sync(options.path);
};
