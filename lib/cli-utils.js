"use strict";

const config    = require('./config');
const path      = require('path');
const SimpleGit = require('simple-git');
const fs        = require('fs');
const spawn     = require('cross-spawn-async');

module.exports.questions = function(questionsObject) {
  var questions = [];

  Object.getOwnPropertyNames(questionsObject).forEach(function(questionKey) {
    var question = questionsObject[questionKey];

    if (typeof question === 'string') {
      question = {
        message: question,
        type   : question.trim().slice(-1) === '?' ? 'confirm' : 'input'
      };
    }

    question.name = questionKey;

    questions.push(question);
  });

  return questions;
};

module.exports.path = function(side, dir) {
  return path.join(process.cwd(), config.project.repositories[side].directory, dir || '');
};

module.exports.bin = function(side) {
  return module.exports.path(side, config.runners[side].bin);
};

module.exports.getOrigin = function(options, side) {
  if (typeof options === 'string') {
    side    = options;
    options = {};
  }

  options      = options || {};
  let source   = options.source || config.project.source;
  let username = options.username || config.git.user.name;
  let project  = options.projectName || config.project.name;
  side         = (side === 'project' || !side) ? '' : `-${side}`;

  return `${config.sources[source]}:${username}/${project}${side}.git`;
};

module.exports.setOrigin = function(side) {
  return new Promise(function(resolve) {
    let simpleGit = SimpleGit(module.exports.path(side));

    simpleGit.addRemote('origin', module.exports.getOrigin(side)).then(() => {
      resolve();
    });
  });
};

module.exports.setRemotes = function(options) {
  return new Promise(function(resolve) {
    let simpleGit = SimpleGit(path.join(process.cwd(), options.directory));

    if (options.upstream) {
      return simpleGit.addRemote('upstream', options.upstream).then(function() {
        resolve();
      });
    }

    return simpleGit.addRemote('origin', options.origin).then(() => {
      resolve();
    });
  });
};

module.exports.installDependencies = function(directory) {
  let promises = [];
  let packageConfig;

  function install(type) {
    promises.push(new Promise((resolve, reject) => {
      let install = spawn(type, ['install'], {cwd: directory}).on('close', code => {
        if (code === 0) {
          return resolve();
        }

        return reject(code);
      });

      install.stdout.on('data', data => {});
      install.stderr.on('data', data => {});
    }));
  }

  try {
    packageConfig = JSON.parse(fs.readFileSync(`${directory}/package.json`));
  } catch(error) {
  }

  if (packageConfig.dependencies || packageConfig.devDependencies) {
    install('npm');
  }

  if (packageConfig.jspm) {
    install('jspm');
  }

  return Promise.all(promises);
}

module.exports.config = config;
