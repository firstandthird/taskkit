'use strict';

const RunKitTask = require('runkit-task');

class ReloadConfigTask extends RunKitTask {
  get description() {
    return 'Reload your project config files when changes are made to them';
  }

  execute(allDone) {
    // does not run on first load
    if (!this.hasInit) {
      this.hasInit = true;
      return allDone();
    }
    const config = this.kit.loadConfig.get();
    Object.keys(this.kit.runner.tasks).forEach((taskName) => {
      const task = this.kit.runner.tasks[taskName];
      if (task instanceof RunKitTask) {
        const taskConfig = config[taskName];
        task.updateOptions(taskConfig);
      }
    });
    this.kit.runner.run(this.options.taskOnUpdate, allDone);
  }
}
module.exports = ReloadConfigTask;
