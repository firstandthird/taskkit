'use strict';
const path = require('path');
const async = require('async');
const confi = require('confi');
const fs = require('fs');
const clientkitVersion = require('../package.json').version;
const defaults = require('lodash.defaults');

module.exports = (clientkitConfPath, projectConfPath, env, allDone) => {
  async.auto({
    // load everything from the conf directory, package.json, and clientkit.yaml:
    directory: (done) => {
      done(null, confi({
        env,
        package: true,
        path: [
          clientkitConfPath,
          projectConfPath,
          // will try to load the 'clientkit.yaml' from the project dir:
          {
            env: 'default',
            path: projectConfPath,
            prefix: 'clientkit'
          }
        ],
        context: {
          // a reference to the clientkit-core folder:
          CKCORE: path.join(__dirname, '..'),
          // a reference to the clientkitConf parent folder:
          CKDIR: path.join(clientkitConfPath, '..'),
          CONFIGDIR: projectConfPath,
          clientkitVersion
        }
      }));
    },
    configFile: (done) => {
      const configFilePath = path.join(projectConfPath, 'clientkit.yaml');
      fs.exists(configFilePath, (configFileExists) => {
        if (configFileExists) {
          // parse that yaml:
          return done(null, confi({
            path: projectConfPath,
            env: 'clientkit',
            context: {
              CKDIR: path.join(__dirname, '..'),
              CONFIGDIR: projectConfPath
            }
          }));
        }
        done(null, {});
      });
    }
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    // merge all the results and return:
    const config = defaults(results.directory, results.configFile);
    console.log(config)
    console.log(config.t)
    allDone(null, config);
  });
};
