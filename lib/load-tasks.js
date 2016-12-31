'use strict';
const RunTask = require('runtask');
const async = require('async');
const cachedTasks = {};
const path = require('path');
const ClientkitTask = require('clientkit-task');

const hooks = ['preInit', 'postInit', 'process', 'postProcess'];

module.exports = function(config, log, allDone) {
  const runner = new RunTask();
  // get list of all tasks:
  const taskList = Object.keys(config.tasks);
  hooks.forEach((hook) => {
    cachedTasks[hook] = new ClientkitTask(hook, {}, runner, log);
    runner.register(hook, cachedTasks[hook]);
  });
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
          initialize: (checkCache, tryToLoadFromLocal, tryToLoadFromProject, done) => {
            if (checkCache) {
              return done();
            }
            const Cls = tryToLoadFromLocal || tryToLoadFromProject;
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
