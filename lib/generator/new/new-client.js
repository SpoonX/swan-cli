var config    = require('../../config');
var SimpleGit = require('simple-git');
var path      = require('path');
var fs        = require('fs');

module.exports = function(options) {
  var projectName = options.projectName + '-client';
  var projectPath = path.join(process.cwd(), projectName);
  var simpleGit = SimpleGit(projectPath);

  fs.mkdirSync(projectPath);

  return simpleGit.clone(config.clientSkeleton, to(projectName))
    .then(() => {
      return simpleGit.removeRemote('origin');
    })
    .then(() => {
      return simpleGit.addRemote('origin', options.clientRepository);
    })
    .then(() => {
      return simpleGit.addRemote('upstream', config.clientSkeleton);
    });

  function to(file) {
    return path.join(options.path, file);
  }
};
