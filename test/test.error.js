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

tap.test('can keep running when an error occurs in a task', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_error_continue');
  // will log the error, but not throw it up the chain:
  try {
    await main();
  } catch (e) {
    t.fail();
  }
  t.end();
});

tap.test('can throw error up when an error occurs in a task', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf_error_stop');
  // error will actually throw
  try {
    await main();
  } catch (e) {
    t.end();
    return;
  }
  t.fail();
});
