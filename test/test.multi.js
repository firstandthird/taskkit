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
    t.notEqual(results[3].indexOf('bin.js\nexample\nindex.js\nlib\nnode_modules\npackage.json\nREADME.md\ntasks\ntest\n'), -1);
    t.notEqual(results[5].indexOf('free  ::  Running free...'));
    t.notEqual(results[6].indexOf('total'), -1); // all versions of free have at least 'total' in them
    t.end();
  }, 1500);
});
