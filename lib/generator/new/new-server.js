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
    initRepository(path.join(process.cwd(), projectName))
      .then(() => overrideDefaultFiles(options.repositories.server.directory))
      .then(() => utils.setRemotes(options.repositories.server))
      .then(() => addDependencies(options, config.serverDependencies))
      .then(() => addDependencies(options, config.serverDevDependencies, true))
      .then(done);
  });
}

function initRepository(location) {
  return new Promise(resolve => {
    SimpleGit(location).init().then(resolve);
  });
}

function addDependencies(options, dependencies, forDev) {
  var directory    = options.repositories.server.directory;
  var installParam = (forDev) ? '--save-dev' : '--save';

  return new Promise(resolve => {
    spawn('npm', ['install'].concat(dependencies, [installParam]), {cwd: directory}).on('close', resolve);
  });
}

function overrideDefaultFiles(serverDirectory) {
  var mapper   = config.templateMapper;
  var promises = [];

  for (var i in mapper) {
    var src  = Object.keys(mapper[i])[0];
    var dest = mapper[i][src];

    if (dest.indexOf('{client}') > -1) {
      continue;
    }

    if (dest.indexOf('{server}') > -1) {
      dest = dest.replace('{server}', serverDirectory);
    }

    promises.push(new Promise((resolve, reject) => {
      cp(path.join(config.templatePath, src), path.join(process.cwd(), dest), error => {
        if (error) {
          return reject();
        }

        resolve();
      });
    }));
  }

  return Promise.all(promises);
}
