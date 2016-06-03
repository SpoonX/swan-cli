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
  let protocol = this.getProtocol(options.source || config.project.source);
  let username = options.username || config.git.user.name;
  let project  = options.projectName || config.project.name;
  side         = (side === 'project' || !side) ? '' : `-${side}`;

  return `${protocol}${username}/${project}${side}.git`;
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

module.exports.getProtocol = function (source) {
  return (!config.system || config.system.protocol === 'https') ? config.sources[source].https : config.sources[source].ssh;
}

module.exports.convertProtocol = function(str, source) {
  var source   = config.sources[source];
  var protocol = config.system.protocol;


  if (protocol === 'https' && str.search(source.ssh) > -1) {
    return str.replace(source.ssh, source.https);
  }

  if (protocol === 'ssh' && str.search(source.https) > -1) {
    return str.replace(source.https, source.ssh);
  }

  return str;
}

// update the existing protocol with the new one e.g ssh to https
module.exports.updateProjectProtocol = function(protocol) {
  let self = this;
  let repositories;
  let swanConfig;

  try {
    swanConfig   = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'swan.json'), "utf8"));
    repositories = swanConfig.repositories;
  } catch(error) {
  }

  if (!repositories) {
    return;
  }

  function renameRemote(simpleGit, remote) {
    simpleGit.removeRemote(remote.name)
      .then(() => simpleGit.addRemote(remote.name, self.convertProtocol(remote.refs.fetch, swanConfig.source)));
  }

  for (var i in repositories) {
    let simpleGit = SimpleGit(path.join(process.cwd(), repositories[i].directory));

    simpleGit.getRemotes(true, (error, remotes) => {
      if (error) {
        console.log(`Unable to set remotes for ${repositories[i].directory}!`, error);
        return;
      }

      for (var j in remotes) {
        renameRemote(simpleGit, remotes[j])
      }
    });
  }
}

module.exports.cloneRepo = function(src, dest, prefixUser) {
  let simpleGit = SimpleGit(process.cwd());
  var protocol  = this.getProtocol('Github');

  if (prefixUser) {
    src = `${config.git.user.name}/${src}`;
  }

  return simpleGit.clone(`${protocol}${src}.git`, dest);
}

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
