#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("conventional-changelog -p angular -i CHANGELOG.md -s -r 0");
