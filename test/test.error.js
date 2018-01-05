'use strict';
const tap = require('tap');
const main = require('../index.js');
const path = require('path');
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

tap.test(' can keep running when an error occurs in a task', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_error_continue');
  await main();
  await wait(2000);
  t.equal(results)
  // t.equal(results.length, 8);
  t.end();
});
