#!/usr/bin/env node
'use strict';
const main = require('./index.js');
const yargs = require('yargs');

const argv = yargs
  .option('init', {
    describe: 'create a new project directory ',
    default: false,
    type: 'string'
  })
  .option('env', {
    describe: 'environment (eg "dev", "staging", "prod")',
    default: 'dev'
  })
  .option('config', {
    describe: 'a path to your configuration files'
  })
  .help('h')
  // .env(true)
  .argv;
main({}, argv);
