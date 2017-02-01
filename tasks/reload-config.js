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
    const config = this.kit.loadConfig.get();
    Object.keys(this.kit.runner.tasks).forEach((taskName) => {
      const task = this.kit.runner.tasks[taskName];
      if (task instanceof TaskKitTask) {
        const taskConfig = config[taskName];
        task.updateOptions(taskConfig);
      }
    });
    if (!this.options.taskOnUpdate) {
      return this.log('Warning: You should set reloadConfig.taskOnUpdate to the name of a task you want to execute when config is updated');
    }
    this.kit.runner.run(this.options.taskOnUpdate, allDone);
  }
}
module.exports = ReloadConfigTask;
