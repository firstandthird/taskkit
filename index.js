const getTasks = require('./lib/getTasks');
const getConfig = require('./lib/getConfig');
const main = async (task) => {
  const config = await getConfig();

  const runner = getTasks(config);
  runner.run(task, (err, results) => {
    if (err) {
      if (config && config.crashOnError === true) {
        throw err;
      }
    }
  });
};

module.exports = main;
