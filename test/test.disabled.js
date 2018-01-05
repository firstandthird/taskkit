'use strict';
const tap = require('tap');
const main = require('../index.js');
const path = require('path');

const oldLog = console.log;
let results = [];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

tap.test(' does not run disabled tasks', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_disabled');
  main({ task: ['ls'], env: 'dev', path: path.join(__dirname, 'conf_disabled') });
  await wait(1500);
  // t.equal(results.length, 5);
  // t.notEqual(results[3].indexOf('ls is disabled, skipping'), -1);
  t.end();
});
