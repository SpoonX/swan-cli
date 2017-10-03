#!/usr/bin/env node
var program = require('commander');

program
  .command('new [projectname]', 'Create a new project')
  .command('start', 'Start project for dev')
  .command('configure', 'Configure github settings')
  .command('setup', 'Setup a project')
  .version(getVersion())
  .parse(process.argv);

function getVersion() {
  return require(__dirname + '/../package.json').version;
}
