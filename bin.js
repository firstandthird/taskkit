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

module.exports.argv = argv;
// if run from command line:
if (process.argv[1].endsWith('bin.js')) {
  main({}, argv);
}
