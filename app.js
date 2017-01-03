#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const configLoader = require('./lib/config');
const loadTasks = require('./lib/load-tasks');

const log = new Logr({
  type: 'cli-fancy',
  reporters: {
    'cli-fancy': require('logr-cli-fancy')
  }
});

let argv = yargs
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

const main = (options) => {
  // packages that use clientkit-core as a dependency can over-ride any argv's they want:
  log(['clientkit'], `Using local config directory: ${argv.config}, environment is "${argv.env}", version is ${require('./package.json').version}`);
  const clientkitConf = path.join(process.cwd(), 'conf');
  // will try to load the 'clientkit.yaml' from the project dir:
  let configPaths = [clientkitConf, argv.config, {
    env: 'default',
    path: argv.config,
    prefix: 'clientkit'
  }];
  if (options && options.confDirectories) {
    configPaths = configPaths.concat(options.confDirectories);
  }
  configLoader(configPaths, argv.env, (err, conf) => {
    if (err) {
      log(['clientkit'], err);
    }
    if (!conf) {
      process.exit(1);
    }
    if (conf.core) {
      throw new Error('please upgrade your config to the new version');
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
    log(['clientkit'], `Running ${task}...`);
    const pluginDirectories = options && options.pluginDirectories ? options.pluginDirectories : [];
    loadTasks(conf, pluginDirectories, log, (loadErr, runner) => {
      if (loadErr) {
        throw loadErr;
      }
      runner.run(task, (runErr) => {
        if (runErr) {
          log(['clientkit', 'error'], runErr);
        }
      });
    });
  });
};

module.exports = main;
