'use strict';
const confi = require('confi');
const path = require('path');

module.exports = function() {
  const prefix = process.env.TASKKIT_PREFIX || 'taskkit';
  const configPaths = [];

  const env = process.env.NODE_ENV || 'dev';
  const primaryConfig = process.env.TASKKIT_CONFIG || path.join(process.cwd(), prefix);

  configPaths.push(primaryConfig);
  configPaths.push({
    env,
    path: process.cwd(),
    prefix
  });

  return confi({
    path: configPaths,
    context: {
      CONFIGDIR: primaryConfig
    }
  });
};
