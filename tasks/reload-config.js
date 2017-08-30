'use strict';

const TaskKitTask = require('taskkit-task');

class ReloadConfigTask extends TaskKitTask {
  get description() {
    return 'Reload your project config files when changes are made to them';
  }

  execute(allDone) {
    // does not run on first load
    if (!this.hasInit) {
      this.hasInit = true;
      return allDone();
    }
    // needs to reload the main config:
    this.kit.loadConfig.get((err, config) => {
      if (err) {
        return allDone(err);
      }
      Object.keys(this.kit.runner.tasks).forEach((taskName) => {
        const task = this.kit.runner.tasks[taskName];
        if (task instanceof TaskKitTask) {
          const taskConfig = config[taskName];
          task.updateOptions(taskConfig);
        }
      });
      if (!this.options.taskOnUpdate) {
        return this.kit.runner.run('default', allDone);
      }
      this.kit.runner.run(this.options.taskOnUpdate, allDone);
    });
  }
}
module.exports = ReloadConfigTask;
