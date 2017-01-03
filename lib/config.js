'use strict';
const path = require('path');
const async = require('async');
const confi = require('confi');
const clientkitVersion = require('../package.json').version;

module.exports = (configPaths, env, allDone) => {
  async.auto({
    // load everything from the conf directory, package.json, and clientkit.yaml:
    directory: (done) => {
      done(null, confi({
        env,
        package: true,
        path: configPaths,
        context: {
          // a reference to the clientkit-core folder:
          CKCORE: path.join(__dirname, '..'),
          // a reference to the clientkitConf parent folder:
          CKDIR: path.join(configPaths[0], '..'),
          CONFIGDIR: configPaths[1],
          clientkitVersion
        }
      }));
    },
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    allDone(null, results.directory);
  });
};
