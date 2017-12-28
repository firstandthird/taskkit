const path = require('path');
const parentRequire = require('parent-require');
const name = process.env.TASKKIT_NAME;
const task = process.env.TASKKIT_TASK;
const getConfig = require('./getConfig');

// if task is config, pass the whole thing, little bit of a hack
const main = async function() {
  const config = await getConfig();

  const taskConfig = config[name] || {};
  //if (taskConfig.enabled === false) {
    //log([name], `${name} is disabled, skipping`);
    //return callback();
  //}

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
  });

  cls.execute((err, results) => {
    if (err) {
      throw err;
    }
  });
};
main();
