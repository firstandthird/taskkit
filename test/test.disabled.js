'use strict';
const tap = require('tap');
const main = require('../index.js');
const path = require('path');
const fs = require('fs');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const oldLog = console.log;
let results = [];

tap.beforeEach((done) => {
  results = [];
  console.log = (input) => {
    results.push(input);
  };
  done();
});

tap.afterEach((done) => {
  done();
});

tap.test(' does not run disabled tasks', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_disabled');
  await main('disabled');
  await wait(1500);
  t.equal(results[0].endsWith('Task disabled is disabled, skipping...'), true);
  t.end();
});
