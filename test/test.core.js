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

tap.test(' loads and runs the default task with printout', (t) => {
  main({ }, { _: [], env: 'dev', config: path.join(__dirname, 'conf') });
  setTimeout(() => {
    t.equal(results.length, 6);
    t.notEqual(results[1].indexOf('taskkit  ::  Running default...'), -1);
    t.notEqual(results[2].indexOf('free  ::  Running free...'), -1);
    t.notEqual(results[3].indexOf('total'), -1);
    t.end();
  }, 1500);
});

tap.test(' loads and runs a named task with printout', (t) => {
  main({ }, { _: ['ls'], env: 'dev', config: path.join(__dirname, 'conf') });
  setTimeout(() => {
    t.equal(results.length, 6);
    t.notEqual(results[0].indexOf('environment is "dev"'), -1);
    t.notEqual(results[1].indexOf('taskkit  ::  Running ls...'), -1);
    t.notEqual(results[2].indexOf('ls  ::  Running ls...'), -1);
    t.notEqual(results[3].indexOf('bin.js\nexample\nindex.js\nlib\nnode_modules\npackage.json\nREADME.md\ntasks\ntest\n'), -1);
    t.notEqual(results[4].indexOf('ls  ::  Finished in'), -1);
    t.notEqual(results[5].indexOf('taskkit  ::  Finished all'), -1);
    t.end();
  }, 1500);
});

//
// tap.test(' does not run disabled tasks', (t) => {
//   main({});
//   t.end();
// });
//
// tap.test('can pull version from package.json', (t) => {
//   main({});
//   t.end();
// });
