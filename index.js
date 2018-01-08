const getTasks = require('./lib/getTasks');
const getConfig = require('./lib/getConfig');
const main = async (task = 'default') => {
  const config = await getConfig();

  const runner = getTasks(config);

  try {
    await runner.run(task);
  } catch (err) {
    // if crashOnError then throw the error up the chain:
    if (config && config.crashOnError === true) {
      throw err;
    }
  }
};

module.exports = main;
