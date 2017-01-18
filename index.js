#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const loadTasks = require('./lib/load-tasks');
const async = require('async');
const LoadConfig = require('./lib/load-config');

const log = new Logr({
  type: 'cli-fancy',
  reporters: {
    'cli-fancy': require('logr-cli-fancy')
  }
});

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
  .env(true)
  .argv;

const main = (options) => {
  options = options || {};
  const configPaths = options.configPaths || [];
  const context = options.context || {};
  const name = options.name || 'runkit';
  const configPath = argv.config || path.join(process.cwd(), name);
  const version = options.version || require('./package.json').version;
  const env = argv.env;
  log([name], `Using config directory: ${configPath}, environment is "${env}", version is ${version}`);

  configPaths.push(configPath);
  configPaths.push({
    env: argv.env,
    path: process.cwd(),
    prefix: name
  });
  context.CONFIGDIR = configPath;

  async.autoInject({
    loadConfig(done) {
      const config = new LoadConfig(name, env, configPaths, context);
      done(null, config);
    },
    config(loadConfig, done) {
      done(null, loadConfig.get());
    },
    task(done) {
      let task = '';
      const cmd = argv._;
      if (cmd.length === 0) {
        task = 'default';
      } else if (cmd.length === 1) {
        task = argv._[0];
      } else {
        task = cmd;
      }
      log([name], `Running ${task}...`);
      done(null, task);
    },
    runner(config, loadConfig, done) {
      loadTasks(config, log, loadConfig, done);
    },
    runTask(runner, task, done) {
      runner.run(task, done);
    }
  }, (err, results) => {
    if (err) {
      log([name, 'error'], err);
    }
  });
};

module.exports = main;
