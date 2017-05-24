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

  get(callback) {
    confi({
      env: this.env,
      package: {
        key: this.name,
        path: process.cwd()
      },
      path: this.configPaths,
      context: this.context
    }, (err, config) => {
      if (err) {
        return callback(err);
      }
      if (!config.tasks) {
        config.tasks = {};
      }
      config.tasks.help = path.join(__dirname, '../tasks/help');
      config.tasks.config = path.join(__dirname, '../tasks/config');
      config.tasks.reloadConfig = path.join(__dirname, '../tasks/reload-config');
      callback(null, config);
    });
  }
}
module.exports = LoadConfig;
