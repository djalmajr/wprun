#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("git push && git push --tags");
