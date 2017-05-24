#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const loadTasks = require('./lib/load-tasks');
const async = require('async');
const LoadConfig = require('./lib/load-config');
const fs = require('fs');
const log = Logr.createLogger({
  reporters: {
    cliFancy: {
      reporter: require('logr-cli-fancy')
    },
    bell: {
      reporter: require('logr-reporter-bell')
    }
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
  const name = options.name || 'taskkit';
  const configPath = argv.config || path.join(process.cwd(), name);

  const env = argv.env;

  configPaths.push(configPath);
  configPaths.push({
    env: argv.env,
    path: process.cwd(),
    prefix: name
  });
  context.CONFIGDIR = configPath;

  const start = new Date().getTime();
  async.autoInject({
    version(done) {
      if (options.version) {
        return done(null, options.version);
      }
      fs.exists('./package.json', (exists) => {
        if (!exists) {
          return done(null, 'unknown');
        }
        return done(null, require('./package.json').version);
      });
    },
    loadConfig(version, done) {
      log([name], `Using config directory: ${configPath}, environment is "${env}", version is ${version}`);
      const config = new LoadConfig(name, env, configPaths, context);
      done(null, config);
    },
    config(loadConfig, done) {
      loadConfig.get(done);
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
      if (results.config && results.config.crashOnError === true) {
        throw err;
      }
    }
    const end = new Date().getTime();
    const duration = (end - start) / 1000;
    log([name], `Finished all ${duration} seconds`);
  });
};

module.exports = main;
