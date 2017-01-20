'use strict';
const purdy = require('purdy');
const TaskKitTask = require('taskkit-task');

class ConfigTask extends TaskKitTask {
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
