'use strict';
const tap = require('tap');
const main = require('../index.js');
const path = require('path');

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

tap.test(' can keep running when an error occurs in a task', (t) => {
  main({ version: '1.0.0' }, { _: [], env: 'dev', config: path.join(__dirname, 'conf_error_continue') });
  setTimeout(() => {
    t.equal(results.length, 8);
    t.end();
  }, 1500);
});
