
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

module.exports = function(name, task, runner, enabled) {
  return async function(callback) {
    if (enabled === false) {
      log([name], `Task ${name} is disabled, skipping...`);
      return;
    }
    log([name], `Running ${name}...`);
    const start = new Date().getTime();
    try {
      const { results } = await runshell(`${path.join(__dirname)}/runner.js`, {
        env: {
          TASKKIT_NAME: name,
          TASKKIT_TASK: task,
          FORCE_COLOR: 1
        },
        onMessage(msg) {
          if (msg.type === 'run') {
            runner.run(msg.task, (e) => {
              log([msg.task], 'error', e);
            });
          }
        },
        logger(tags, msg) {
          if (typeof tags === 'string') {
            msg = tags;
            tags = [];
          }
          msg = msg.replace(/\n$/, '');
          //TODO: remove when all tasks are on latest taskkit-task
          if (msg.indexOf('::') !== -1) {
            console.log(msg); //eslint-disable-line no-console
          } else {
            log([name, ...tags], msg);
          }
        }
      });
      const end = new Date().getTime();
      const duration = (end - start) / 1000;
      log([name], `Finished in ${duration} seconds`);
      return callback(null, results);
    } catch (err) {
      log([name, 'error'], err);
      return callback(err);
    }
  };
};
