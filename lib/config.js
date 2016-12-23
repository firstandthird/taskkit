'use strict';
const path = require('path');
const async = require('async');
const confi = require('confi');

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
          CONFIGDIR: projectConfPath
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
