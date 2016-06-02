"use strict";

const path      = require('path');
const fs        = require('fs');
const spawn     = require('cross-spawn-async');
const config    = require('../../config');
const utils     = require('../../cli-utils');
const SimpleGit = require('simple-git');
const cp        = require('cp');

module.exports = function(options) {
  return new Promise(resolve => {
    createServer(options, () => {
      resolve();
    });
  });
};

function createServer(options, done) {
  let projectName    = options.repositories.server.directory;
  let user           = config.git.user;
  let projectOptions = ['new', projectName, '--no-frontend', `--author=${user.name}`, `--description=${user.description}`];

  spawn(config.sails.bin, projectOptions).on('close', () => {
    cp(path.join(config.templatePath, 'project/.sailsrc'), path.join(process.cwd(), projectName, '.sailsrc'), error => {
      if (error) {
        throw error;
      }

      initRepository(path.join(process.cwd(), projectName))
        .then(() => utils.setRemotes(options.repositories.server))
        .then(() => addDependencies(options))
        .then(done);
    });
  });
}

function initRepository(location) {
  return new Promise(resolve => {
    SimpleGit(location).init().then(resolve);
  });
}

function addDependencies(options, dependencies) {
  var directory = options.repositories.server.directory;

  return new Promise(resolve => {
    spawn('npm', ['install'].concat(config.serverDependencies, ['--save']), {cwd: directory}).on('close', resolve);
  });
}
