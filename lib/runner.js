const path = require('path');
const confi = require('confi');
const parentRequire = require('parent-require');
const name = process.argv[2];
const task = process.argv[3];

// if task is config, pass the whole thing, little bit of a hack
confi({
  env: 'dev',
  path: [
    { env: 'dev', path: process.cwd(), prefix: 'taskkit' }
  ],
  context: {
  },
  package: {

  }
}, (configErr, config) => {
  if (configErr) {
    throw err;
  }

  //const taskConfig = config[name] || {};
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
  const taskConfig = config[name];
  const cls = new Cls(name, taskConfig, {
  });

  cls.execute((err, results) => {
    if (err) {
      throw err;
    }
  });
});
