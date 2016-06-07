#!/usr/bin/env node

"use strict";

// swan setup github:spoonx/todo-example

const program     = require('commander');
const colors      = require('colors');
const utils       = require('../lib/cli-utils');
const path        = require('path');
const setup       = require('../lib/setup');
const heart       = '<3 '.bold.blue;
const heartBroken = '</3 '.bold.red;
const inquirer    = require('inquirer');
const config      = require('../lib/config');
const questions   = utils.questions({
  slug  : {
    message : 'Enter the slug of the github repository (e.g. "swanstack/swan-cli").',
    default : config.defaultSlug,
    validate: function(input) {
      if (!input || input.split('/').length === 2) {
        return true;
      }

      return `Expected the argument to have the format "user/respo". e.g. ` + config.defaultSlug.bold;
    },
    when: function(optionsSoFar) {
      if (program.args[0]) {
        optionsSoFar.slug = program.args[0];
      }

      return !optionsSoFar.slug;
    }
  }
});

program.parse(process.argv);

if (!config.system) {
  console.log(`${heartBroken}You need to be authenticated to run this command, run ` + `swan configure`.bold +  ` before continuing.`);
  return;
}

inquirer.prompt(questions, function(answers) {
  answers.source = 'Github';

  setup(answers)
    .then(() => {
      console.log(`\n${heart}Setup has been completed for` + ` ${answers.slug}`.bold);
      process.exit();
    })
    .catch(error => {
      console.log(`\n${heartBroken}` + error);
      process.exit();
    });
});
