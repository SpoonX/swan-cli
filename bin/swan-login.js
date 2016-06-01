#!/usr/bin/env node

"use strict";

const fs          = require('fs');
const path        = require('path');
const program     = require('commander');
const readline    = require('readline');
const colors      = require('colors');
const utils       = require('../lib/cli-utils');
const heart       = '<3 '.bold.blue;
const heartBroken = '</3 '.bold.red;
const inquirer    = require('inquirer');

program.parse(process.argv);

inquirer.prompt(utils.questions({token: 'Enter your personal access token:'}), answers => {
  let home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

  fs.writeFile(path.join(home, '.swan'), JSON.stringify({token: answers.token}), error => {
    if (error) {
      console.log(`${heartBroken}Something went wrong!`, error);
    } else {
      console.log(`${heart}Logged in successfully!`);
    }
  });
});
