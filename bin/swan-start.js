#!/usr/bin/env node

"use strict";

const colors  = require('colors');
const utils   = require('../lib/cli-utils');
const spawn   = require('child_process').spawn;
const program = require('commander');

program
  .option('-v, --verbose', 'Detailed logging', null, null)
  .parse(process.argv);

run('client');
run('server');

function run(side) {
  let runner     = utils.config.runners[side];
  let bin        = utils.path(side, runner.bin);
  let parameters = runner.parameters;
  let child;

  if (program.verbose) {
    parameters.push('--verbose');
  }

  child = spawn(bin, parameters, {cwd: utils.path(side)});
  console.log('Program:'.underline.bold.green + ` started ${side}!`);

  redirectOutput(side, child);
}

function redirectOutput(prefix, child) {
  if (program.verbose) {
    child.stdout.pipe(process.stdout);
  }

  child.stderr.pipe(process.stderr);

  child.on('close', code => {
    process.stdout.write(`"${prefix}" process exited with code ${code}`);
  });
}
