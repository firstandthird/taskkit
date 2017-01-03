#!/usr/bin/env node
const path = require('path');
const main = require('./app.js');
main({
  pluginDirectories: [path.join(process.cwd(), 'tasks')]
});
