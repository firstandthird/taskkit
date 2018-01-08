'use strict';
const purdy = require('purdy');
const TaskKitTask = require('taskkit-task');

class ConfigTask extends TaskKitTask {
  get description() {
    return 'Prints out the config';
  }

  execute() {
    const clone = Object.assign({}, this.fullConfig);
    delete clone.ENV;

    purdy(clone, {
      depth: null,
      arrayIndex: false
    });
  }
}
module.exports = ConfigTask;
