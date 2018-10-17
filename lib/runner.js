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
    runTask(taskName) {
      if (!process.send) {
        return console.log(`Error running task ${taskName}`); //eslint-disable-line no-console
      }
      process.send({ type: 'run', task: taskName });
    }
  });

  if (cls.usesAsync) {
    try {
      await cls.execute();
    } catch (e) {
      console.log(e);
      process.exit(1); //throw e;
    }
  } else {
    cls.execute((err, results) => {
      if (err) {
        console.log(err);
        process.exit(1); // throw err;
      }
    });
  }
};
main();
