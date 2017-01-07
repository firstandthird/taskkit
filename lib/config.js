'use strict';
const async = require('async');
const confi = require('confi');

module.exports = (configPaths, context, env, allDone) => {
  async.auto({
    // load everything from the conf directory, package.json, and clientkit.yaml:
    directory: (done) => {
      done(null, confi({
        env,
        package: true,
        path: configPaths,
          /*
          clientkitConfPath,
          projectConfPath,
          // will try to load the 'clientkit.yaml' from the project dir:
          {
            env: 'default',
            path: projectConfPath,
            prefix: 'clientkit'
          }
          */
        context
      }));
    },
  }, (err, results) => {
    if (err) {
      return allDone(err);
    }
    allDone(null, results.directory);
  });
};
