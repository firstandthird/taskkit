'use strict';
const tap = require('tap');
const main = require('../index.js');
const path = require('path');

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

tap.test(' lets you run a list of multiple tasks', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_multi');
  await main();
  t.notEqual(results.indexOf('             ls  ::  Running ls...'), -1);
  t.notEqual(results.indexOf('           free  ::  Running free...'), -1);
  t.end();
});
