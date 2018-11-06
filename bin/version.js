#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("npm run changelog && git add CHANGELOG.md");
