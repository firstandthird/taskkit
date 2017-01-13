'use strict';
const purdy = require('purdy');
const RunKitTask = require('runkit-task');

class ConfigTask extends RunKitTask {
  get description() {
    return 'Prints out the config';
  }

  execute(allDone) {
    const clone = Object.assign({}, this.kit.config);
    delete clone.ENV;

    purdy(clone, {
      depth: null,
      arrayIndex: false
    });
    return allDone();
  }
}
module.exports = ConfigTask;
