'use strict';

const TaskKitTask = require('taskkit-task');

class ReloadConfigTask extends TaskKitTask {
  get description() {
    return 'Reload your project config files when changes are made to them';
  }

  execute(allDone) {
    this.log('This has been deprecated, please remove');
    allDone();
  }
}
module.exports = ReloadConfigTask;
