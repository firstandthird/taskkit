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

tap.test(' loads and runs the default task with printout', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf');
  await main();
  t.equal(results[0].endsWith('free  ::  Running free...'), true);
  t.notEqual(results[2].indexOf('free  ::  Finished in'), -1);
  t.end();
});

tap.test(' loads and runs a named task with printout', async(t) => {
  process.env.TASKKIT_PREFIX = 'default';
  process.env.TASKKIT_CONFIG = path.join(__dirname, 'conf');
  await main('ls');
  const output = results[1].split('\n');
  t.notEqual(output.indexOf('example'), -1);
  t.notEqual(output.indexOf('node_modules'), -1);
  t.notEqual(output.indexOf('index.js'), -1);
  t.end();
});
