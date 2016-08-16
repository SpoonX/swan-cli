#!/usr/bin/env node

"use strict";

const fs          = require('fs');
const program     = require('commander');
const colors      = require('colors');
const utils       = require('../lib/cli-utils');
const config      = require('../lib/config');
const heart       = '<3 '.bold.blue;
const heartBroken = '</3 '.bold.red;
const inquirer    = require('inquirer');
const questions   = {
  username: {
    message : 'What is your github username:',
    default : (config.git) ? config.git.user.name : '',
    validate: function (input) {
      if (typeof input === 'string' && /\S+/.test(input)) {
        return true;
      }

      return 'Expected a valid github username.';
    }
  },
  'personal access token': {
    message : 'Enter your personal access token:',
    filter: string => {string.trim()},
    validate: function(input) {
      if (input && input.length === 40) {
        return true;
      }

      return 'Expected the argument to be a personal access token.';
    }
  },
  protocol: {
    message: 'Which protocol do you want to use:',
    type   : 'list',
    choices: ['https', 'ssh']
  }
}

program.parse(process.argv);

if (!config.system) {
  return initConfiguration();
}

editConfiguration();

function initConfiguration() {
  inquirer.prompt(utils.questions(questions), saveConfiguration);
}

function editConfiguration() {
  var subQuestion = {};

  inquirer.prompt(utils.questions({
    edit: {
      message: 'What do you want to reconfigure?',
      type   : 'list',
      choices: Object.keys(questions)
    }
  }), answer => {
    subQuestion[answer['edit']] = questions[answer['edit']];

    // set previous given answer to default
    if (subQuestion[answer['edit']].choices) {
      subQuestion[answer['edit']].default = config.system[answer['edit']];
    }

    inquirer.prompt(utils.questions(subQuestion), saveConfiguration);
  });
}

function saveConfiguration (settings) {
  let home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

  // easiest way to display `personal access token` in the reconfigure option
  if (settings['personal access token']) {
    settings['token'] = settings['personal access token'];
    delete settings['personal access token'];
  }

  if (settings.username) {
    utils.setUsername(settings.username);

    delete settings.username; // don't save in swan
  }

  // merge with existing settings
  if (config.system) {
    for (var attr in settings) {
      if (attr === 'protocol' && config.system[attr] !== settings[attr]) {
        utils.updateProjectProtocol(attr);
      }

      config.system[attr] = settings[attr];
    }

    settings = config.system;
  }

  fs.writeFile(`${home}/.swan`, JSON.stringify(settings), error => {
    if (error) {
      console.log(`${heartBroken}Something went wrong!`, error);
    } else {
      console.log(`${heart}Saved configuration!`);
    }
  });
}
