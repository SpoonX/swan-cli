# Swan CLI
*The command line interface for SWAN.*

SWAN as a stack runs [**S**ails](http://sailsjs.org/), [**W**aterline](https://github.com/balderdashy/waterline), [**A**urelia](http://aurelia.io) and [**N**ode](https://nodejs.org).

**Note:** This module is work in progress.
It already provides some useful methods, but isn't _done_ yet.
Contributions are more than welcome.

## What?
The SWAN stack makes developing applications a lot easier and faster. It follows the following principles:

- **Separate repositories:** The project, the API and the client live in separate repositories.
- **API-driven development:** Separation of client (static files) and server (API).
- **Single entity definition:** Entities (and thus API endpoints) are the same on both the server and the client, including validation.

## Installation

1. Install swan and the other dependencies: `npm i -g sails jspm gulp swan`
2. Create a [personal access token](https://github.com/settings/tokens) on github and set permissions for `repo`.
3. Type `swan login` and enter the access token.
4. Enjoy!

## Usage
Usage is described in the `swan --help` output.

#### New project
To create a new project.

```
swan new projectname
```

#### Collaborate on existing project
To start working on, or check out a project.

```
swan setup owner/repository
```

For instance `swan setup spoonx/aurelia-todo`.

#### Start your project
Start your project. This starts both the server, and the client in one convenient command.

```
swan start --v
```


## Configuration
Swan can be configured by changing the contents of the `swan.json` file.

## Coming soon(ish)
* Getting started
* Swan install (to quickly set up your project after cloning).
* Support for mobile.

## Disclaimer
This project is a little bit messy. It's relatively easy to get into, but it could be structured much better.
This is the first version, meant as a PoC to figure out what works best for SWAN.
This means it _will_ be refactored at some point, but the usage will most likely stay the same.
