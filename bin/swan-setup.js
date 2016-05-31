#!/usr/bin/env node

"use strict";

// swan setup github:spoonx/todo-example

const program   = require('commander');
const colors    = require('colors');
const utils     = require('../lib/cli-utils');
const path      = require('path');
const setup     = require('../lib/setup');
const heart     = '<3 '.bold.blue;
const inquirer  = require('inquirer');
const questions = utils.questions({
  source: {
    type   : 'list',
    choices: ['Github', 'Bitbucket'],
    message: 'Where is your project hosted:',
    default: 'Github',
    when   : function(optionsSoFar) {
      let firstArg = program.args[0];

      if (!firstArg) {
        return true;
      }

      let parts = firstArg.split(':');

      if (parts.length !== 2) {
        throw 'Expected the first argument to have the format "source:user/repo". e.g. "github:swanstack/swan-cli".';
      }

      optionsSoFar.source = parts[0];
      optionsSoFar.slug   = parts[1];

      return false;
    }
  },
  slug  : {
    message: 'Enter the slug of the repository (e.g. "swanstack/swan-cli").',
    when   : function(optionsSoFar) {
      if (program.args[0]) {
        optionsSoFar.slug = program.args[0];
      }

      return !optionsSoFar.slug;
    }
  }
});

program.parse(process.argv);

inquirer.prompt(questions, function(answers) {
  setup(answers)
    .then(() => {
      console.log(`\n${heart}Created project` + ` ${answers.projectName}!`.bold);
      console.log(`${heart}Make sure to verify the existence of the repositories on ${answers.source}.`);
    });
});
