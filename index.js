#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const configLoader = require('./lib/config');
const loadTasks = require('./lib/load-tasks');
const async = require('async');

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
    describe: 'a path to your configuration files',
    default: path.join(process.cwd(), 'clientkit')
  })
  .help('h')
  .env(true)
  .argv;

const main = (configPaths, context) => {
  configPaths = configPaths || [];
  context = context || {};
  log(['clientkit'], `Using local config directory: ${argv.config}, environment is "${argv.env}", version is ${require('./package.json').version}`);

  configPaths.push(argv.config);
  configPaths.push({
    env: argv.env,
    path: process.cwd(),
    prefix: 'clientkit'
  });
  context.CONFIGDIR = argv.config;

  async.autoInject({
    config(done) {
      configLoader(configPaths, context, argv.env, (err, conf) => {
        if (err) {
          return done(err);
        }
        if (!conf) {
          return done(new Error('configuration not found'));
        }
        if (conf.core) {
          return done(new Error('please upgrade your config to the new version'));
        }
        done(null, conf);
      });
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
      log(['clientkit'], `Running ${task}...`);
      done(null, task);
    },
    registerBuiltIn(config, done) {
      config.tasks.help = path.join(__dirname, 'tasks/help');
      config.tasks.config = path.join(__dirname, 'tasks/config');
      config.config = {
        needsEntireConfig: true
      };
      done();
    },
    runner(config, registerBuiltIn, done) {
      loadTasks(config, log, done);
    },
    runTask(runner, task, done) {
      runner.run(task, done);
    }
  }, (err, results) => {
    if (err) {
      log(['clientkit', 'error'], err);
    }
  });
};

module.exports = main;
