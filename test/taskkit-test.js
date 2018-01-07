'use strict';
const TaskKitTask = require('taskkit-task');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFileAsync = util.promisify(fs.writeFile);

class TestTask extends TaskKitTask {
  get description() {
    return 'This is the test task';
  }

  async execute() {
    const outputFileName = path.join(__dirname, this.options.outputFile);
    this.log(`Test task writing to ${outputFileName}`);
    await readFileAsync(outputFileName, JSON.stringify(this));
  }
}
module.exports = TestTask;
