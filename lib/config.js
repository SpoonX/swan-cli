var path          = require('path');
var fs            = require('fs');
var ini           = require('ini');
var home          = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
var configPath    = path.join(home, '.gitconfig');
var projectConfig = null;

try {
  fs.statSync(process.cwd() + '/swan.json');

  projectConfig = require(process.cwd() + '/swan.json');
} catch (error) {
}

module.exports = {
  sources       : {Bitbucket: 'git@bitbucket.org', Github: 'git@github.com'},
  git           : ini.parse(fs.readFileSync(configPath, 'utf-8')),
  sails         : {
    bin: path.resolve(__dirname, '../node_modules/.bin/sails')
  },
  runners       : {
    server: {bin: 'sails', parameters: ['lift']},
    client: {bin: 'gulp', parameters: ['watch']}
  },
  templatePath  : path.resolve(__dirname, '../templates'),
  clientSkeleton: 'git@github.com:swanstack/aurelia-skeleton.git',
  project       : projectConfig
};

try {
  module.exports.auth = require(path.join(home, '.swan'));
} catch (error) {
}
