'use strict';
const RunTask = require('runtask');
const async = require('async');
const cachedTasks = {};
const path = require('path');

module.exports = function(config, pluginDirectories, log, allDone) {
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
        async.autoInject({
          checkCache: (done) => done(null, cachedTasks[name]),
          tryToLoadFromLocal: (checkCache, done) => {
            if (checkCache) {
              return done(null, checkCache);
            }
            let module;
            try {
              module = require(task);
            } catch (e) {
            } finally {
              return done(null, module);
            }
          },
          // imports node modules installed in your CKDIR project:
          tryToLoadFromProject: (tryToLoadFromLocal, done) => {
            if (tryToLoadFromLocal) {
              return done(null, tryToLoadFromLocal);
            }
            let module;
            try {
              module = require(path.join(config.CKDIR, 'node_modules', task));
            } catch (e) {
            } finally {
              return done(null, module);
            }
          },
          // imports task modules from any additional plugin directories that were passed:
          tryToLoadFromPluginDirectories: (tryToLoadFromProject, done) => {
            if (tryToLoadFromProject) {
              return done(null, tryToLoadFromProject);
            }
            let module;
            if (Array.isArray(pluginDirectories)) {
              for (let i = 0; i < pluginDirectories.length; i++) {
                try {
                  module = require(path.join(pluginDirectories[i], task));
                  return done(null, module);
                } catch (e) {
                }
              }
              return done();
            }
          },
          initialize: (checkCache, tryToLoadFromLocal, tryToLoadFromProject, tryToLoadFromPluginDirectories, done) => {
            if (checkCache) {
              return done();
            }
            const Cls = tryToLoadFromLocal || tryToLoadFromProject || tryToLoadFromPluginDirectories;
            if (!Cls) {
              console.log('Unable to find task %s after looking in the following places:', task);
              console.log(task);
              console.log(path.join(config.CKDIR, 'node_modules'));
              console.log(pluginDirectories.join('\n'));
            }
            // if task is config, pass the whole thing, little bit of a hack
            const taskConfig = (config[name] && config[name].needsEntireConfig) ? config : config[name];
            cachedTasks[name] = new Cls(name, taskConfig, runner, log);
            done();
          },
          execute: (initialize, done) => {
            cachedTasks[name].execute(callback);
          }
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
