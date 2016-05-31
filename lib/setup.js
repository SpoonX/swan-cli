"use strict";

const config = require('./config');
const Github = require('api-github');

/**
 * 1. Check if user already forked repo
 * 1.1 If not, fork.
 * 2. Clone fork
 * 3. Set remotes
 * 4. Install dependencies
 */

module.exports = function(options) {
  let github = new Github({auth: {token: config.auth.token}});

  let repositoryName = options.slug.split('/')[1];

  github.repos.find(`${config.git.user.name}/${repositoryName}`)
    .then()
    .catch(error => {
      if (error.statusCode === 404) {

      }
    });
};
