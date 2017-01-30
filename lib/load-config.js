'use strict';
const confi = require('confi');
const path = require('path');

class LoadConfig {
  constructor(name, env, configPaths, context) {
    this.name = name;
    this.env = env;
    this.configPaths = configPaths;
    this.context = context;
  }

  get() {
    const config = confi({
      env: this.env,
      package: {
        key: this.name,
        path: process.cwd()
      },
      path: this.configPaths,
      context: this.context
    });

    if (!config.tasks) {
      config.tasks = {};
    }
    config.tasks.help = path.join(__dirname, '../tasks/help');
    config.tasks.config = path.join(__dirname, '../tasks/config');
    config.tasks.reloadConfig = path.join(__dirname, '../tasks/reload-config');

    return config;
  }
}
module.exports = LoadConfig;
