var fs        = require('fs');
var SimpleGit = require('simple-git');
var path      = require('path');

/**
 * @param {{projectRepository: ''}} options
 * @return {Promise}
 */
module.exports = function(options) {
  return createProject(options);
};

function createProject(options) {
  function to(file) {
    return path.join(options.path, file);
  }

  var simpleGit = SimpleGit();

  return simpleGit
    .init()
    .then(function() {
      return simpleGit.addRemote('origin', options.projectRepository);
    })
    .then(function() {
      return fs.writeFileSync(to('swan.json'), makeConfig(options));
    })
    .then(function() {
      return fs.writeFileSync(to('.gitignore'), makeGitIgnore());
    });
}

function makeGitIgnore() {
  return [
    'server',
    'client'
  ].join('\n');
}

function makeConfig(options) {
  return JSON.stringify({
    name   : options.projectName,
    project: {
      repository: options.projectRepository,
      directory : '.'
    },
    server : {
      repository: options.serverRepository,
      directory : 'server'
    },
    client : {
      repository: options.clientRepository,
      directory : 'client'
    }
  }, null, 2);
}
