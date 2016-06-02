## Going deep
SWAN follows some best practises and beliefs. These are relatively simple, and explained below.

### Project overview
Every project is split up in three repositories:

* Project
* Client
* Server

### Project
The project holds meta-data for your project. It holds the swan.json, documentation and perhaps a wiki. This is the goto repository when starting work on this project. This is also the repository you use to get started, as it is responsible for also cloning your other repositories.

By default, the project repository has a `.gitignore` for the client and the server repository. The reason for this is because swan works contained in a single directory. This means you will initially start out with the following directory structure:

```
./coolname
./coolname/coolname-client
./coolname/coolname-server
```

### Client
This repository holds the client side code for your project. This will be an aurelia application based on our skeleton, that allows you to work on the project with manual (boilerplate) code.
