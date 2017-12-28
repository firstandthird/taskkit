'use strict';
const RunTask = require('runtask');
const path = require('path');
const runshell = require('runshell');
const Logr = require('logr');
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


module.exports = function(config) {
  const runner = new RunTask();
  config.tasks.help = `${__dirname}/../tasks/help.js`;
  config.tasks.config = `${__dirname}/../tasks/config.js`;
  Object.keys(config.tasks).forEach(name => {
    const task = config.tasks[name];
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else { // task is wrapped by a function that will lazy-load/cache it:
      taskFn = function(callback) {
        log([name], `Running ${name}...`);
        const start = new Date().getTime();
        runshell('node', {
          args: `${path.join(__dirname)}/runner.js ${name} ${task}`,
          env: {
            TASKKIT_NAME: name,
            TASKKIT_TASK: task,
            FORCE_COLOR: 1
          },
          logger: (tags, msg) => {
            if (typeof tags === 'string') {
              msg = tags;
              tags = [];
            }
            //TODO: remove when all tasks are on latest taskkit-task
            if (msg.indexOf('::') !== -1) {
              console.log(msg); //eslint-disable-line no-console
            } else {
              log([name, ...tags], msg);
            }
          }
        }, (err, results) => {
          const end = new Date().getTime();
          const duration = (end - start) / 1000;
          if (err) {
            log([name, 'error'], err);
          }
          log([name], `Finished in ${duration} seconds`);
          callback(err, results);
        });
      };
    }
    runner.register(name, taskFn);
  });
  return runner;
};
