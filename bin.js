#!/usr/bin/env node
'use strict';
const main = require('./index.js');
const yargs = require('yargs');

const argv = yargs
  .option('env', {
    describe: 'environment (eg "dev", "staging", "prod")',
    default: 'dev'
  })
  .option('config', {
    describe: 'a path to your configuration files'
  })
  .help('h')
  .env(true)
  .argv;

if (argv.config) {
  process.env.TASKKIT_CONFIG = argv.config;
}

if (argv.env) {
  process.env.NODE_ENV = argv.config;
}

let task = '';
const cmd = argv._;
if (cmd.length === 0) {
  task = 'default';
} else if (cmd.length === 1) {
  task = argv._[0];
} else {
  task = cmd;
}
main(task);
