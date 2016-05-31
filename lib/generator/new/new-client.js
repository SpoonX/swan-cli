"use strict";

const config    = require('../../config');
const utils     = require('../../cli-utils');
const SimpleGit = require('simple-git');
const path      = require('path');
const fs        = require('fs');
const spawn     = require('cross-spawn-async');

module.exports = function(options) {
  var projectName = options.projectName + '-client';
  var projectPath = path.join(process.cwd(), projectName);
  var simpleGit   = SimpleGit(projectPath);

  fs.mkdirSync(projectPath);

  return new Promise((resolve, reject) => {
    simpleGit.clone(config.clientSkeleton, to(projectName)).then(() => {
      simpleGit.removeRemote('origin').then(() => {
        utils.setRemotes(options.repositories.client)
          .then(() => install(options.repositories.client.directory))
          .then(resolve).catch(reject);
      });
    });
  });

  function to(file) {
    return path.join(options.path, file);
  }
};

function install(directory) {
  let promises = [];

  promises.push(new Promise((resolve, reject) => {
    let npmInstall = spawn('npm', ['install'], {cwd: directory}).on('close', code => {
      if (code === 0) {
        return resolve();
      }

      return reject(code);
    });

    npmInstall.stdout.on('data', data => { });
    npmInstall.stderr.on('data', data => { });
  }));

  promises.push(new Promise((resolve, reject) => {
    let jspmInstall = spawn('jspm', ['install'], {cwd: directory}).on('close', code => {
      if (code === 0) {
        return resolve();
      }

      return reject(code);
    });

    jspmInstall.stdout.on('data', data => { });
    jspmInstall.stderr.on('data', data => { });
  }));

  return Promise.all(promises);
}
