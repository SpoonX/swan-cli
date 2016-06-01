"use strict";

const config    = require('../../config');
const utils     = require('../../cli-utils');
const SimpleGit = require('simple-git');
const path      = require('path');
const fs        = require('fs');

module.exports = function(options) {
  var projectName = options.projectName + '-client';
  var projectPath = path.join(process.cwd(), projectName);
  var simpleGit   = SimpleGit(projectPath);

  fs.mkdirSync(projectPath);

  return new Promise((resolve, reject) => {
    simpleGit.clone(config.clientSkeleton, to(projectName)).then(() => {
      simpleGit.removeRemote('origin').then(() => {
        utils.setRemotes(options.repositories.client)
          .then(() => utils.installDependencies(options.repositories.client.directory))
          .then(resolve).catch(reject);
      });
    });
  });

  function to(file) {
    return path.join(options.path, file);
  }
};
