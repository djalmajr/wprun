#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("npm run build && gh-pages -d dist");
