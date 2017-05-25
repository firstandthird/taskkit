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

tap.test(' does not run disabled tasks', (t) => {
  main({ }, { _: ['ls'], env: 'dev', config: path.join(__dirname, 'conf_disabled') });
  setTimeout(() => {
    t.equal(results.length, 5);
    t.notEqual(results[3].indexOf('ls is disabled, skipping'), -1);
    t.end();
  }, 1500);
});
