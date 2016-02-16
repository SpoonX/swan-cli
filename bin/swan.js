#!/usr/bin/env node
var program = require('commander');

program
  .command('new [projectname]', 'Create a new project')
  .parse(process.argv);
