var path      = require('path');
var spawn     = require('win-spawn');
var config    = require('../../config');
var SimpleGit = require('simple-git');
var cp        = require('cp');

module.exports = function(options) {
 return new Promise(resolve => {
   createServer(options, () => {
     resolve();
   });
 });
};

function createServer(options, done) {
  var projectName = options.projectName + '-server';

  spawn(config.sails.bin,
    ['new', projectName, '--no-frontend', '--author=' + config.git.user.name, '--description=' + config.git.user.description]
  ).on('close', function() {
    cp(path.join(config.templatePath, 'project/.sailsrc'), path.join(process.cwd(), projectName, '.sailsrc'), function(error) {
      if (error) {
        throw error;
      }

      var simpleGit = SimpleGit(path.join(process.cwd(), projectName));

      simpleGit
        .init()
        .then(function() {
          return simpleGit.addRemote('origin', options.serverRepository);
        })
        .then(done);
    });
  });
}

