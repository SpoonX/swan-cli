"use strict";

const fs        = require('fs');
const SimpleGit = require('simple-git');
const config    = require('../../config');
const path      = require('path');
const utils     = require('../../cli-utils');

/**
 * @param {{projectRepository: ''}} options
 * @return {Promise}
 */
module.exports = function(options) {
  function to(file) {
    return path.join(options.path, file);
  }

  return initRepository()
    .then(() => {
      fs.writeFileSync(to('swan.json'), makeConfig(options));
      fs.writeFileSync(to('.gitignore'), makeGitIgnore(options));
    })
    .then(() => utils.setRemotes(options.repositories.project));
};

function initRepository() {
  return new Promise(resolve => {
    SimpleGit().init().then(resolve);
  });
}

function makeGitIgnore(options) {
  return [
    options.repositories.client.directory,
    options.repositories.server.directory,
    '.idea',
    '.DS_STORE'
  ].join('\n');
}

function makeConfig(options) {
  let configuration = {
    name        : options.projectName,
    source      : options.source,
    repositories: options.repositories
  };

  config.project = configuration;

  return JSON.stringify(configuration, null, 2);
}
