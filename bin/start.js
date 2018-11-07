#! /usr/bin/env node
var shell = require("shelljs");

const envs = ["NODE_ENV=development"];

process.argv.forEach(arg => {
  const parts = arg.split("=");

  if (parts[0] === "--hot") {
    envs.push("HOT=true");
  } else if (parts.length === 2 && parts[1]) {
    envs.push(arg);
  }
});

shell.exec(`cross-env ${envs.join(" ")} webpack-dev-server --mode=development`);
