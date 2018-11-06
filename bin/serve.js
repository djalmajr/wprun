#! /usr/bin/env node
var shell = require("shelljs");
shell.exec("npm run build && live-server dist --open");
