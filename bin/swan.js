#!/usr/bin/env node
var program = require('commander');

program
  .command('new [projectname]', 'Create a new project')
  .command('start', 'Start project for dev')
  .command('login', 'Authenticate with github')
  .parse(process.argv);
