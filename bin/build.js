#! /usr/bin/env node
var shell = require("shelljs");
const mode = process.argv[2] || "--mode=production";
const env = mode.split("=")[1];
shell.exec(`cross-env NODE_ENV=${env} webpack ${mode}`);
