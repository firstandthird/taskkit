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


tap.test(' lets you run a list of multiple tasks', (t) => {
  main({ }, { _: [], env: 'dev', config: path.join(__dirname, 'conf_multi') });
  setTimeout(() => {
    t.equal(results.length, 9);
    // some files/dirs that will be present in the directory when 'ls' is executed:
    t.notEqual(results[3].indexOf('bin.js'), -1);
    t.notEqual(results[3].indexOf('node_modules'), -1);
    t.notEqual(results[3].indexOf('index.js'), -1);
    t.notEqual(results[5].indexOf('free  ::  Running free...'));
    t.notEqual(results[6].indexOf('total'), -1); // all versions of free have at least 'total' in them
    t.end();
  }, 1500);
});
