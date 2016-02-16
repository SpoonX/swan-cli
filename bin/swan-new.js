#!/usr/bin/env node
var program   = require('commander');
var validator = require('validator');
var utils     = require('../lib/cli-utils');
var path      = require('path');
var createNew = require('../lib/generator/new');
var username  = require('../lib/config').git.user.name;
var inquirer  = require('inquirer');
var questions = utils.questions({
  projectName      : {
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
  description      : 'Enter a nice description for the project:',
  projectRepository: {
    message: 'Enter the repository url for the project:',
    default: function(optionsSoFar) {
      return `git@github.com:${username}/${optionsSoFar.projectName}.git`;
    }
  },
  serverRepository : {
    message: 'Enter the repository url for the server:',
    default: function(optionsSoFar) {
      return `git@github.com:${username}/${optionsSoFar.projectName}-server.git`;
    }
  },
  clientRepository : {
    message: 'Enter the repository url for the client:',
    default: function(optionsSoFar) {
      return `git@github.com:${username}/${optionsSoFar.projectName}-client.git`;
    }
  }
});

program.parse(process.argv);

inquirer.prompt(questions, function(answers) {
  createNew(answers)
    .then(() => {
      console.log(`Created project ${answers.projectName}!`);
    });
});
