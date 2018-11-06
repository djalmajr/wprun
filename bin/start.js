#! /usr/bin/env node
var shell = require("shelljs");

const envs = process.argv
  .slice(2)
  .concat("NODE_ENV=development")
  .join(" ");

shell.exec(`cross-env ${envs} webpack-dev-server --mode=development`);
