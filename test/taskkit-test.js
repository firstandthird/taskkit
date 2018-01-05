'use strict';
const TaskKitTask = require('taskkit-task');
const fs = require('fs');
const path = require('path');
class TestTask extends TaskKitTask {
  get description() {
    return 'This is the test task';
  }

  execute(allDone) {
    const outputFileName = path.join(__dirname, this.options.outputFile);
    this.log(`Test task writing to ${outputFileName}`);
    fs.writeFile(outputFileName, JSON.stringify(this), allDone);
    allDone();
  }
}
module.exports = TestTask;
