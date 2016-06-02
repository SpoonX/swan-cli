#!/usr/bin/env node
const program   = require('commander');
const colors    = require('colors');
const utils     = require('../lib/cli-utils');
const path      = require('path');
const createNew = require('../lib/generator/new');
const heart     = '<3 '.bold.blue;
const username  = require('../lib/config').git.user.name;
const inquirer  = require('inquirer');
const questions = utils.questions({
  projectName: {
    message: 'Enter the name of your new project:',
    when   : function(optionsSoFar) {
      var firstArg = program.args[0];
      var cwd, isCwd;

      if (!firstArg) {
        return true;
      }

      cwd                      = process.cwd();
      isCwd                    = ['.', './'].indexOf(firstArg) > -1;
      optionsSoFar.projectName = isCwd ? cwd.substr(cwd.lastIndexOf('/') + 1) : firstArg;
      optionsSoFar.path        = isCwd ? cwd : path.join(cwd, firstArg);
    }
  },
  source     : {
    type   : 'list',
    choices: ['Github', 'Bitbucket'],
    message: 'Where is your project hosted:',
    default: 'Github'
  },
  description: 'Enter a nice description for the project:',
  owner      : {
    message: 'Enter the name of the owner (upstream, e.g. google, spoonx):',
    default: username
  },
  username   : {
    when   : function(optionsSoFar) {
      var userIsOwner = optionsSoFar.owner.toLowerCase() === username.toLowerCase();

      if (userIsOwner) {
        optionsSoFar.username = username;
        optionsSoFar.owner    = null;
      }

      return !userIsOwner;
    },
    message: 'Enter your username:',
    default: username
  }
});

program.parse(process.argv);

inquirer.prompt(questions, function(answers) {
  createNew(answers)
    .then(() => {
      console.log(`\n${heart}Created project` + ` ${answers.projectName}!`.bold);
      console.log(`${heart}Make sure to verify the existence of the repositories on ${answers.source}.`);
    });
});
