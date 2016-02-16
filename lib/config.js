var path       = require('path');
var fs         = require('fs');
var ini        = require('ini');
var configPath = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.gitconfig');
module.exports = {
  git           : ini.parse(fs.readFileSync(configPath, 'utf-8')),
  sails         : {
    bin: path.resolve(__dirname, '../node_modules/.bin/sails')
  },
  templatePath  : path.resolve(__dirname, '../templates'),
  clientSkeleton: 'git@github.com:swanstack/aurelia-skeleton.git'
};
