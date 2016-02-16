var newProject = require('./new-project');
var newServer  = require('./new-server');
var newClient  = require('./new-client');
var path       = require('path');
var mkdirp     = require('mkdirp');

module.exports = function executeNew(options) {
  options.path = options.path || path.join(process.cwd(), options.projectName);
  mkdirp.sync(options.path);
  process.chdir(options.path);

  return newProject(options)
    .then(() => {
      return newServer(options);
    })
    .then(() => {
      return newClient(options);
    });
};
