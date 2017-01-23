'use strict';
const RunTask = require('runtask');
const async = require('async');
const parentRequire = require('parent-require');
const path = require('path');
const cachedTasks = {};

module.exports = function(config, log, loadConfig, allDone) {
  const runner = new RunTask();
  // get list of all tasks:
  const taskList = Object.keys(config.tasks);
  // register all tasks with a wrapper that will lazy-load/cache it if its actually used
  async.each(taskList, (name, next) => {
    const task = config.tasks[name];
    let taskFn;
    if (Array.isArray(task)) { //task maps to other tasks
      taskFn = task;
    } else { // task is wrapped by a function that will lazy-load/cache it:
      taskFn = (callback) => {
        const start = new Date().getTime();
        if (!cachedTasks[name]) {
          log([name], `Running ${name}...`);
          let Cls = null;
          try {
            //try to load in current project
            let taskPath = task;
            if (task[0] !== '/') {
              taskPath = path.join(process.cwd(), 'node_modules', task);
            }
            Cls = require(taskPath);
          } catch (e) {
            //use if layer on top of core
            try {
              Cls = parentRequire(task);
            } catch (e2) {
              log(['error'], e);
              log(['error', 'parent-require'], e2);
            }
          }
          // if task is config, pass the whole thing, little bit of a hack
          const taskConfig = config[name];
          if (taskConfig.enabled === false) {
            log([name], `${name} is disabled, skipping`);
            return callback();
          }
          cachedTasks[name] = new Cls(name, taskConfig, {
            config,
            loadConfig,
            runner,
            log,
            logger: log //hack for now
          });
        }
        cachedTasks[name].execute((err, results) => {
          const end = new Date().getTime();
          const duration = (end - start) / 1000;
          log([name], `Finished in ${duration} seconds`);
          callback(err, results);
        });
      };
    }
    runner.register(name, taskFn);
    next();
  }, (err) => {
    if (err) {
      return allDone(err);
    }
    allDone(null, runner);
  });
};
