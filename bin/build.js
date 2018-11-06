#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("cross-env NODE_ENV=production webpack --mode=production");
