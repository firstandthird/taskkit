'use strict';
const confi = require('confi');
const path = require('path');
const fs = require('fs');
const async = require('async');
class LoadConfig {
  constructor(name, env, configPaths, context) {
    this.name = name;
    this.env = env;
    this.configPaths = configPaths;
    this.context = context;
  }

  get(callback) {
    const self = this;
    async.autoInject({
      packageExists(done) {
        fs.exists(path.join(process.cwd(), 'package.json'), (exists) => done(null, exists));
      },
      options(packageExists, done) {
        const options = {
          env: self.env,
          path: self.configPaths,
          context: self.context
        };
        if (packageExists) {
          options.package = {
            key: self.name,
            path: process.cwd()
          };
        }
        return done(null, options);
      },
      config(options, done) {
        confi(options, done);
      },
      setup(config, done) {
        if (!config.tasks) {
          config.tasks = {};
        }
        config.tasks.help = path.join(__dirname, '../tasks/help');
        config.tasks.config = path.join(__dirname, '../tasks/config');
        config.tasks.reloadConfig = path.join(__dirname, '../tasks/reload-config');
        return done();
      }
    }, (err, results) => {
      callback(err, results.config);
    });
  }
}
module.exports = LoadConfig;
