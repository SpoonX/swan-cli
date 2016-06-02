"use strict";

const config    = require('./config');
const utils     = require('./cli-utils');
const Github    = require('api-github');
const SimpleGit = require('simple-git');
const fs        = require('fs');
const readline  = require('readline');

let github = new Github({auth: {token: config.auth.token}});
let repositoryName;

module.exports = function(options) {
  repositoryName  = options.slug.split('/')[1];

  if (fs.readdirSync('./').indexOf(repositoryName) > -1) {
    return Promise.reject(`A directory named ` + `${repositoryName}`.bold + ` already exists, rename or remove the directory and try again.`);
  }

  return setupRepo(options);
};

function setupRepo(options, isForked) {
  let simpleGit       = SimpleGit(process.cwd);
  let repositoryPath  = `./${repositoryName}`;
  let done            = ` Done!`.bold.green + `\n`;
  let repositoryOwner = options.slug.split('/')[0];
  let retryCount      = 0;
  let source          = `${config.sources[options.source]}:${config.git.user.name}`;
  let swanConfig;
  let serverDirectory;
  let clientDirectory;

  let rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout
  });

  function checkForkedRepo (repository) {
    return new Promise((resolve, reject) => {
      function checkRepository() {
        setTimeout(() => {
          if (++retryCount === 30) {
            return reject('Repository not forked after 30 retries. Please try running the same command again.');
          }

          github.repos.find(repository).then(resolve).catch(checkRepository);
        }, 500);
      }

      checkRepository();
    });
  }

  function forkRepo(repository, slug) {
    var repo = `${config.git.user.name}/${repository}`;

    return github.repos.find(repo)
      .then(() => {
        return Promise.resolve();
      })
      .catch(error => {
        if (error.statusCode !== 404) {
          throw error;
        }

        return github.repos.fork(slug).then(() => checkForkedRepo(repo));
      });
  }

  rl.setPrompt('');
  rl.write('- Forking project.');
  return forkRepo(repositoryName, options.slug)
    .then(() => rl.write(done + '- Cloning project.'))
    .then(() => simpleGit.clone(`${source}/${repositoryName}.git`, repositoryPath))
    .then(() => {
      try {
        swanConfig      = JSON.parse(fs.readFileSync(`${repositoryPath}/swan.json`)).repositories;
        serverDirectory = swanConfig.server.directory;
        clientDirectory = swanConfig.client.directory;
      } catch (e) {
        throw `Couldn't find swan.json in ${repositoryPath}`;
      }
    })
    .then(() => rl.write(done + '- Forking server and client.'))
    .then(() => forkRepo(serverDirectory, `${repositoryOwner}/${serverDirectory}`))
    .then(() => forkRepo(clientDirectory, `${repositoryOwner}/${clientDirectory}`))
    .then(() => rl.write(done + '- Cloning server and client.'))
    .then(() => simpleGit.clone(`${source}/${serverDirectory}.git`, `${repositoryPath}/${serverDirectory}`))
    .then(() => simpleGit.clone(`${source}/${clientDirectory}.git`, `${repositoryPath}/${clientDirectory}`))
    .then(() => rl.write(done + '- Setting remotes.'))
    .then(() => utils.setRemotes({upstream: swanConfig.project.upstream, directory: repositoryPath}))
    .then(() => utils.setRemotes({upstream: swanConfig.server.upstream, directory: `${repositoryPath}/${serverDirectory}`}))
    .then(() => utils.setRemotes({upstream: swanConfig.client.upstream, directory: `${repositoryPath}/${clientDirectory}`}))
    .then(() => rl.write(done + '- Installing dependencies, this may take a while:' + `\n` ))
    .then(() => rl.write('  - Installing server.'))
    .then(() => utils.installDependencies(`${repositoryPath}/${serverDirectory}`))
    .then(() => rl.write(done + '  - Installing client.'))
    .then(() => utils.installDependencies(`${repositoryPath}/${clientDirectory}`))
    .then(() => rl.write(done))
    .catch(error => {
      console.log(error); // show original error to figure out what went wrong
      throw `Unable to fork ` + `${options.slug}`.bold + `.\nDoes the personal access token have full access to repo?`;
    });
}
