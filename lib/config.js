var path          = require('path');
var fs            = require('fs');
var ini           = require('ini');
var configPath    = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.gitconfig');
var projectConfig = null;

try {
  fs.statSync(process.cwd() + '/swan.json');

  projectConfig = require(process.cwd() + '/swan.json');
} catch (error) {
}

module.exports = {
  git           : ini.parse(fs.readFileSync(configPath, 'utf-8')),
  sails         : {
    bin: path.resolve(__dirname, '../node_modules/.bin/sails')
  },
  runners       : {
    server: {bin: 'node_modules/.bin/sails', parameters: ['lift']},
    client: {bin: 'node_modules/.bin/gulp', parameters: ['watch']}
  },
  templatePath  : path.resolve(__dirname, '../templates'),
  clientSkeleton: 'git@github.com:swanstack/aurelia-skeleton.git',
  project       : projectConfig
};
