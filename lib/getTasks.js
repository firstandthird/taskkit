'use strict';
const RunTask = require('runtask');
const getTask = require('./getTask');

module.exports = function(config) {
  const runner = new RunTask();
  config.tasks.help = `${__dirname}/../tasks/help.js`;
  config.tasks.config = `${__dirname}/../tasks/config.js`;
  Object.keys(config.tasks).forEach(name => {
    const taskConfig = config[name] ? config[name] : {};
    const task = config.tasks[name];
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else { // task is wrapped by a function that will lazy-load/cache it:
      taskFn = getTask(name, task, runner, taskConfig.enabled);
    }
    runner.register(name, taskFn);
  });
  return runner;
};
