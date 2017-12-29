const path = require('path');
const parentRequire = require('parent-require');
const name = process.env.TASKKIT_NAME;
const task = process.env.TASKKIT_TASK;
const getConfig = require('./getConfig');

const main = async function() {
  const config = await getConfig();

  const taskConfig = config[name] || {};

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
    Cls = parentRequire(task);
  }
  const cls = new Cls(name, taskConfig, {
    config,
    runner: {
      run(taskName, cb) {
        process.send({ type: 'run', task: taskName });
        cb();
      }
    }
  });

  cls.execute((err, results) => {
    if (err) {
      throw err;
    }
  });
};
main();
