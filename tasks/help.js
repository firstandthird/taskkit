'use strict';
const TaskKitTask = require('taskkit-task');

class HelpTask extends TaskKitTask {
  get description() {
    return 'Prints various help info about your tasks';
  }

  // prints out a hierarchical set of tasks:
  printTaskList(taskList, level) {
    let buffer = '    ';
    for (let i = 0; i < level; i++) {
      buffer = `  ${buffer}`;
    }
    if (!taskList.forEach) {
      this.log(`${buffer} - ${taskList}`);
    } else {
      taskList.forEach((subtask) => {
        this.printTaskList(subtask, level + 1);
      });
    }
  }

  execute() {
    this.log('Registered tasks: ');
    Object.keys(this.fullConfig.tasks).forEach((taskName) => {
      this.log(`  ${taskName}`);
    });
    this.log('Named Task Sets:');
    Object.keys(this.fullConfig.tasks).forEach((taskName) => {
      const task = this.fullConfig.tasks[taskName];
      if (!task.forEach) {
        return;
      }
      this.log(`  Task Set "${taskName}" has the following sub-tasks:`);
      this.printTaskList(task, 0);
      this.log(''); // <-- blank line for clarity
    });
  }
}
module.exports = HelpTask;
