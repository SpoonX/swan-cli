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

1. Run `npm i -g swan-cli`
2. `swan --help`

## Usage
Following is an overview of commands available to you.

### swan new
Create a new swan project.

```
swan new my-application
```

Use `swan new --help` for more information.

### swan start
Start your project. This starts both the server, and the client in one convenient command.

```
swan start --verbose
```

Use `swan start --help` for more information.

## Configuration
Swan can be configured by changing the contents of the `swan.json` file.

## Coming soon(ish)
* Getting started
* Swan install (to quickly set up your project after cloning).
* Support for mobile.
